import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import FadeInSection from '../ui/FadeInSection'
import CodeBlock from '../ui/CodeBlock'
import ExpandableCard from '../ui/ExpandableCard'
import TabSwitcher from '../ui/TabSwitcher'
import Badge from '../ui/Badge'
import { softwareEras, TEST_FIXER_AGENT, CONVENTION_VALIDATOR_AGENT, agentBenefits } from '../../data/content'

// ─── Sub-agent spawn simulator ─────────────────────────────────────────────

const STEP_DELAY = 850

const AGENT_STEPS = [
  {
    phase: 'userMsg',
    actor: 'user',
    label: '사용자 메시지',
    log: '"테스트 고쳐줘"',
    color: '#f5f0e8',
    nodeActive: 'user',
  },
  {
    phase: 'analyze',
    actor: 'claude',
    label: 'Claude: 분석',
    log: '→ description 매칭: test-fixer ("테스트 실패를 감지하고...")',
    color: '#9ca3af',
    nodeActive: 'claude',
  },
  {
    phase: 'spawn',
    actor: 'claude',
    label: 'Claude: 에이전트 스폰',
    log: '→ 새 컨텍스트 윈도우 생성 — test-fixer 에이전트 시작',
    color: '#d97757',
    nodeActive: 'spawn',
  },
  {
    phase: 'agentRun1',
    actor: 'agent',
    label: 'test-fixer: 테스트 실행',
    log: '[agent] $ ./gradlew test',
    color: '#7dd3fc',
    nodeActive: 'agent',
  },
  {
    phase: 'agentRun2',
    actor: 'agent',
    label: 'test-fixer: 실패 감지',
    log: '[agent] ✗ 2 tests failed: AuthServiceTest, TokenServiceTest',
    color: '#fde68a',
    nodeActive: 'agent',
  },
  {
    phase: 'agentRun3',
    actor: 'agent',
    label: 'test-fixer: 원인 분석 + 수정',
    log: '[agent] → AuthService.kt 토큰 갱신 로직 수정',
    color: '#7dd3fc',
    nodeActive: 'agent',
  },
  {
    phase: 'agentRun4',
    actor: 'agent',
    label: 'test-fixer: 재실행',
    log: '[agent] $ ./gradlew test → ✓ BUILD SUCCESSFUL (12 tests)',
    color: '#86efac',
    nodeActive: 'agent',
  },
  {
    phase: 'returnResult',
    actor: 'claude',
    label: 'Claude: 결과 수신',
    log: '→ 에이전트 완료. 수정 내역 수신 중...',
    color: '#a78bfa',
    nodeActive: 'claude',
  },
  {
    phase: 'respond',
    actor: 'claude',
    label: 'Claude: 사용자 응답',
    log: '✓ 테스트 2개 수정 완료. AuthService 토큰 갱신 로직 수정.',
    color: '#86efac',
    nodeActive: 'user',
  },
]

const FLOW_NODES = [
  { id: 'user',   label: '사용자',    sub: '요청 / 응답 수신', accent: false },
  { id: 'claude', label: 'Claude',   sub: '메인 컨텍스트',    accent: false },
  { id: 'spawn',  label: '↓ 스폰',   sub: '새 컨텍스트 생성', accent: false, connector: true },
  { id: 'agent',  label: 'test-fixer', sub: '독립 실행',      accent: true },
]

function AgentSimulator() {
  const [stepIdx, setStepIdx] = useState(-1)
  const [running, setRunning] = useState(false)
  const timers = useRef([])

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const runDemo = () => {
    if (running) return
    setStepIdx(0)
    setRunning(true)
    AGENT_STEPS.forEach((_, i) => {
      if (i === 0) return
      timers.current.push(setTimeout(() => setStepIdx(i), i * STEP_DELAY))
    })
    timers.current.push(setTimeout(() => setRunning(false), (AGENT_STEPS.length - 1) * STEP_DELAY + 400))
  }

  const reset = () => {
    clearTimers()
    setStepIdx(-1)
    setRunning(false)
  }

  useEffect(() => () => clearTimers(), [])

  const activeStep = AGENT_STEPS[stepIdx]
  const activeNode = activeStep?.nodeActive ?? ''
  const visibleSteps = stepIdx >= 0 ? AGENT_STEPS.slice(0, stepIdx + 1) : []
  const done = !running && stepIdx === AGENT_STEPS.length - 1

  const getNodeState = (id) => {
    if (!activeStep) return 'idle'
    if (id === activeNode) return 'active'
    // nodes that have already been involved
    const involved = AGENT_STEPS.slice(0, stepIdx + 1).map(s => s.nodeActive)
    if (involved.includes(id)) return 'done'
    return 'idle'
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0f1113' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ minHeight: 300 }}>

        {/* Left: flow diagram */}
        <div className="p-5" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[10px] font-mono uppercase tracking-wider mb-4" style={{ color: '#4b5563' }}>에이전트 스폰 흐름</p>

          <div className="space-y-1">
            {FLOW_NODES.map((node, i) => {
              if (node.connector) {
                return (
                  <div key={node.id} className="flex justify-center py-0.5">
                    <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  </div>
                )
              }
              const state = stepIdx < 0 ? 'idle' : getNodeState(node.id)
              const isActive = state === 'active'
              const isDone = state === 'done'

              return (
                <div key={node.id}>
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
                    style={{
                      background: isActive
                        ? (node.accent ? 'rgba(217,119,87,0.1)' : 'rgba(255,255,255,0.05)')
                        : '#141618',
                      border: `1px solid ${isActive
                        ? (node.accent ? 'rgba(217,119,87,0.3)' : 'rgba(255,255,255,0.12)')
                        : isDone ? 'rgba(134,239,172,0.12)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isDone ? '#86efac' : isActive ? (node.accent ? '#d97757' : '#9ca3af') : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      {isDone && <span className="text-[9px] font-bold" style={{ color: '#0b0d0e' }}>✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono transition-colors duration-300"
                        style={{ color: isActive ? (node.accent ? '#d97757' : '#f5f0e8') : isDone ? '#86efac' : '#6b7280' }}>
                        {node.label}
                      </p>
                      <p className="text-[10px]" style={{ color: '#4b5563' }}>{node.sub}</p>
                    </div>
                    {isActive && (
                      <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.9, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: node.accent ? '#d97757' : '#9ca3af' }} />
                    )}
                  </div>
                  {i < FLOW_NODES.length - 1 && !FLOW_NODES[i + 1]?.connector && (
                    <div className="flex justify-center py-0.5">
                      <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Context isolation callout */}
          <div className="mt-4 rounded-lg px-3 py-2.5" style={{ background: 'rgba(217,119,87,0.04)', border: '1px solid rgba(217,119,87,0.1)' }}>
            <p className="text-[10px] leading-relaxed" style={{ color: '#6b7280' }}>
              <span style={{ color: '#d97757' }}>test-fixer</span>는 독립된 컨텍스트 창에서 실행됩니다. 메인 Claude의 대화 히스토리를 오염시키지 않습니다.
            </p>
          </div>
        </div>

        {/* Right: log */}
        <div className="p-5">
          <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: '#4b5563' }}>실행 로그</p>
          <div className="space-y-2 min-h-[200px]">
            <AnimatePresence>
              {stepIdx < 0 && (
                <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs font-mono" style={{ color: '#4b5563' }}>
                  시뮬레이션 대기 중...
                </motion.p>
              )}
              {visibleSteps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
                  className="flex items-start gap-2.5">
                  <span
                    className="text-[10px] font-mono flex-shrink-0 px-1.5 py-0.5 rounded mt-0.5"
                    style={{
                      background: step.actor === 'agent' ? 'rgba(125,211,252,0.08)' : step.actor === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(217,119,87,0.08)',
                      color: step.actor === 'agent' ? '#7dd3fc' : step.actor === 'user' ? '#9ca3af' : '#d97757',
                    }}
                  >
                    {step.actor}
                  </span>
                  <span className="text-xs font-mono leading-relaxed" style={{ color: step.color }}>{step.log}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {done && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="mt-3 pt-3 flex items-center gap-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-xs px-2.5 py-1 rounded-full font-mono"
                  style={{ background: 'rgba(134,239,172,0.12)', color: '#86efac', border: '1px solid rgba(134,239,172,0.25)' }}>
                  ✓ 에이전트 작업 완료
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-xs font-mono" style={{ color: '#4b5563' }}>
          {stepIdx < 0 ? '▶ 실행 버튼으로 에이전트 스폰 흐름 확인' : activeStep?.label ?? ''}
        </span>
        <div className="flex gap-2">
          {stepIdx >= 0 && (
            <button onClick={reset}
              className="text-xs px-3 py-1.5 rounded-lg cursor-pointer"
              style={{ color: '#6b7280', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#9ca3af'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            >
              초기화
            </button>
          )}
          <div className="relative">
            {stepIdx < 0 && !running && (
              <span className="absolute inset-0 rounded-lg animate-ping"
                style={{ background: 'rgba(217,119,87,0.35)', animationDuration: '2s' }} />
            )}
            <button onClick={done ? reset : runDemo} disabled={running}
              className="relative text-xs px-3 py-1.5 rounded-lg cursor-pointer"
              style={{
                background: running ? 'rgba(217,119,87,0.1)' : '#d97757',
                color: running ? '#d97757' : '#0b0d0e',
                border: running ? '1px solid rgba(217,119,87,0.3)' : 'none',
                opacity: running ? 0.7 : 1,
              }}
            >
              {running ? '실행 중...' : done ? '다시 실행' : '▶ 실행'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Era card ──────────────────────────────────────────────────────────────

function EraCard({ era }) {
  return (
    <div className="rounded-xl p-5 h-full"
      style={{
        background: era.accent ? 'rgba(217,119,87,0.05)' : '#141618',
        border: `1px solid ${era.accent ? 'rgba(217,119,87,0.2)' : 'rgba(255,255,255,0.06)'}`,
      }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-mono mb-1" style={{ color: era.accent ? '#d97757' : '#6b7280' }}>{era.era}</p>
          <p className="text-base font-semibold" style={{ color: '#f5f0e8' }}>{era.subtitle}</p>
        </div>
        {era.accent && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(217,119,87,0.15)', color: '#d97757' }}>현재</span>
        )}
      </div>
      <p className="text-sm leading-relaxed mb-4" style={{ color: '#9ca3af' }}>{era.description}</p>
      <ul className="space-y-2">
        {era.traits.map((t, i) => (
          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#6b7280' }}>
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: era.accent ? '#d97757' : '#4b5563' }} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────

export default function SubAgentsSection() {
  const eraTabs = softwareEras.map((era) => ({
    id: era.era,
    label: era.era,
    content: <EraCard era={era} />,
  }))

  return (
    <section className="px-8 md:px-12 py-20 max-w-4xl mx-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <FadeInSection>
        <SectionHeader
          id="sub-agents"
          eyebrow="전문화된 실행자"
          title="Sub-Agents"
          accentWord="Sub-Agents"
          subtitle="단일 책임 원칙(SRP)을 AI에 적용합니다. 각 에이전트는 하나의 전문 역할만 수행하여 집중력과 재사용성을 극대화합니다."
        />
      </FadeInSection>

      {/* Simulator */}
      <FadeInSection delay={0.06}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-2 flex items-center gap-2" style={{ color: '#f5f0e8' }}>
            동작 원리 시뮬레이터
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(217,119,87,0.10)', color: '#d97757', border: '1px solid rgba(217,119,87,0.2)' }}>
              <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
              인터랙티브
            </span>
          </h3>
          <p className="text-sm mb-5" style={{ color: '#6b7280' }}>
            사용자 요청 → Claude가 에이전트 선택 → 독립 컨텍스트에서 실행 → 결과 반환의 흐름을 확인하세요.
          </p>
          <AgentSimulator />
        </div>
      </FadeInSection>

      {/* Software eras */}
      <FadeInSection delay={0.1}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>Software 1.0 vs 3.0</h3>
          <TabSwitcher tabs={eraTabs} defaultTab="Software 1.0" />
        </div>
      </FadeInSection>

      {/* Agent config */}
      <FadeInSection delay={0.14}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-2" style={{ color: '#f5f0e8' }}>
            설정 방법
            <span className="text-xs font-normal ml-2" style={{ color: '#6b7280' }}>— datagsm-server</span>
          </h3>
          <p className="text-sm mb-5" style={{ color: '#6b7280' }}>
            <code style={{ color: '#d97757', background: 'rgba(217,119,87,0.08)', padding: '1px 6px', borderRadius: 4 }}>.claude/agents/</code> 디렉토리에 마크다운 파일을 생성합니다. frontmatter의 <code style={{ color: '#d97757', background: 'rgba(217,119,87,0.08)', padding: '1px 6px', borderRadius: 4 }}>description</code>이 에이전트 선택 기준입니다.
          </p>
          <div className="space-y-3">
            <ExpandableCard title="test-fixer.md — Kotlin 테스트 자동 수정" badge={<Badge variant="green">agents</Badge>} defaultOpen={true}>
              <CodeBlock code={TEST_FIXER_AGENT} language="markdown" filename=".claude/agents/test-fixer.md" seamless />
            </ExpandableCard>
            <ExpandableCard title="convention-validator.md — 코드 컨벤션 자동 검증" badge={<Badge variant="blue">agents</Badge>}>
              <CodeBlock code={CONVENTION_VALIDATOR_AGENT} language="markdown" filename=".claude/agents/convention-validator.md" seamless />
            </ExpandableCard>
          </div>
        </div>
      </FadeInSection>

      {/* SRP callout */}
      <FadeInSection delay={0.18}>
        <div className="mb-10">
          <aside className="rounded-xl p-5"
            style={{ background: 'rgba(217,119,87,0.04)', border: '1px solid rgba(217,119,87,0.15)', borderLeft: '3px solid #d97757' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: '#d97757' }}>SRP와 Sub-Agent</p>
            <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
              Robert C. Martin의 단일 책임 원칙(Single Responsibility Principle)은 "하나의 모듈은 하나의 이유로만 변경되어야 한다"고 말합니다. Sub-Agent도 동일합니다. <strong style={{ color: '#f5f0e8' }}>test-fixer는 테스트 수정만</strong>, <strong style={{ color: '#f5f0e8' }}>convention-validator는 컨벤션 검증만</strong> 담당합니다. 에이전트를 하나로 합치면 집중력이 분산되고, 프롬프트가 비대해지며, 각 역할이 서로를 방해합니다.
            </p>
          </aside>
        </div>
      </FadeInSection>

      {/* Benefits */}
      <FadeInSection delay={0.22}>
        <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>왜 Sub-Agent인가</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {agentBenefits.map((b, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm font-medium mb-1.5" style={{ color: '#f5f0e8' }}>{b.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  )
}
