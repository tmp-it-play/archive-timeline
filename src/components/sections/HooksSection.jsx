import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import FadeInSection from '../ui/FadeInSection'
import CodeBlock from '../ui/CodeBlock'
import ExpandableCard from '../ui/ExpandableCard'
import TabSwitcher from '../ui/TabSwitcher'
import Badge from '../ui/Badge'
import { PRE_TOOL_USE_SH, POST_TOOL_USE_SH, hookLifecycle } from '../../data/content'

// ─── Hook lifecycle simulator ──────────────────────────────────────────────

const STEP_DELAY = 850

const SCENARIOS = {
  block: {
    label: '🛡 위험 명령어 차단',
    command: 'rm -rf /',
    tool: 'Bash',
    steps: [
      { phase: 'preHook',  label: 'PreToolUse 실행',   log: '$ preToolUse.sh 호출됨',                   color: '#7dd3fc' },
      { phase: 'check',    label: '패턴 검사',          log: '→ "rm -rf /" 패턴 감지',                  color: '#fde68a' },
      { phase: 'blocked',  label: '실행 차단 (exit 1)', log: '✗ 차단됨: 위험한 명령어 패턴 감지됨',     color: '#f87171' },
    ],
    outcome: 'blocked',
  },
  edit: {
    label: '✨ 파일 수정 + 포맷팅',
    command: 'Edit AuthServiceImpl.kt',
    tool: 'Edit',
    steps: [
      { phase: 'preHook',  label: 'PreToolUse 실행',   log: '$ preToolUse.sh 호출됨',                         color: '#7dd3fc' },
      { phase: 'check',    label: '패턴 검사',          log: '→ 위험 패턴 없음. exit 0 (통과)',               color: '#86efac' },
      { phase: 'toolRun',  label: 'Edit 도구 실행',     log: '→ AuthServiceImpl.kt 수정 완료',                color: '#f5f0e8' },
      { phase: 'postHook', label: 'PostToolUse 실행',   log: '$ postToolUse.sh 호출됨',                       color: '#a78bfa' },
      { phase: 'format',   label: 'ktlint 실행',        log: '→ ./gradlew ktlintFormat -PinputFiles=...kt',   color: '#fde68a' },
      { phase: 'test',     label: '테스트 자동 실행',   log: '→ ./gradlew test --tests "*AuthService*"',      color: '#fde68a' },
      { phase: 'done',     label: '✓ 테스트 통과',      log: '✓ BUILD SUCCESSFUL (3 tests)',                  color: '#86efac' },
    ],
    outcome: 'success',
  },
}

const LIFECYCLE_NODES = [
  { id: 'user',     label: '사용자 요청',  color: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.1)' },
  { id: 'preHook',  label: 'PreToolUse',  color: 'rgba(125,211,252,0.08)', border: 'rgba(125,211,252,0.25)', accent: '#7dd3fc' },
  { id: 'tool',     label: '도구 실행',   color: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' },
  { id: 'postHook', label: 'PostToolUse', color: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.25)', accent: '#a78bfa' },
]

function HookSimulator() {
  const [scenario, setScenario] = useState('edit')
  const [stepIdx, setStepIdx] = useState(-1)
  const [running, setRunning] = useState(false)
  const timers = useRef([])

  const sc = SCENARIOS[scenario]

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const runDemo = () => {
    if (running) return
    setStepIdx(0)
    setRunning(true)
    sc.steps.forEach((_, i) => {
      if (i === 0) return
      timers.current.push(setTimeout(() => setStepIdx(i), i * STEP_DELAY))
    })
    timers.current.push(setTimeout(() => setRunning(false), (sc.steps.length - 1) * STEP_DELAY + 400))
  }

  const reset = () => {
    clearTimers()
    setStepIdx(-1)
    setRunning(false)
  }

  const handleScenario = (key) => {
    clearTimers()
    setScenario(key)
    setStepIdx(-1)
    setRunning(false)
  }

  useEffect(() => () => clearTimers(), [])

  const activeStep = sc.steps[stepIdx]
  const visibleSteps = stepIdx >= 0 ? sc.steps.slice(0, stepIdx + 1) : []

  // Determine which lifecycle nodes are active
  const activePhase = activeStep?.phase ?? ''
  const getNodeState = (id) => {
    if (activePhase === 'blocked') return id === 'preHook' ? 'blocked' : id === 'tool' ? 'skipped' : 'idle'
    if (['preHook','check'].includes(activePhase)) return id === 'preHook' ? 'active' : 'idle'
    if (activePhase === 'toolRun') return id === 'preHook' ? 'done' : id === 'tool' ? 'active' : 'idle'
    if (['postHook','format','test','done'].includes(activePhase))
      return id === 'preHook' || id === 'tool' ? 'done' : id === 'postHook' ? 'active' : 'idle'
    return 'idle'
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0f1113' }}>

      {/* Scenario selector */}
      <div className="flex gap-1 p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#141618' }}>
        <p className="text-[10px] font-mono uppercase tracking-wider self-center mr-2 flex-shrink-0" style={{ color: '#4b5563' }}>시나리오</p>
        {Object.entries(SCENARIOS).map(([key, s]) => (
          <button key={key} onClick={() => handleScenario(key)}
            className="text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all flex-shrink-0"
            style={{
              background: scenario === key ? 'rgba(217,119,87,0.12)' : 'transparent',
              color: scenario === key ? '#d97757' : '#6b7280',
              border: `1px solid ${scenario === key ? 'rgba(217,119,87,0.25)' : 'transparent'}`,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ minHeight: 260 }}>
        {/* Left: lifecycle flow */}
        <div className="p-5" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[10px] font-mono uppercase tracking-wider mb-4" style={{ color: '#4b5563' }}>Hook 라이프사이클</p>

          {/* Tool badge */}
          <div className="flex items-center gap-2 mb-5 rounded-lg px-3 py-2"
            style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-xs font-mono" style={{ color: '#6b7280' }}>도구:</span>
            <code className="text-xs font-mono" style={{ color: '#d97757' }}>{sc.tool}</code>
            <span className="text-xs font-mono ml-1" style={{ color: '#f5f0e8' }}>{sc.command}</span>
          </div>

          {/* Flow nodes */}
          <div className="space-y-2">
            {LIFECYCLE_NODES.map((node, i) => {
              const state = stepIdx < 0 ? 'idle' : getNodeState(node.id)
              const isBlocked = state === 'blocked'
              const isActive = state === 'active'
              const isDone = state === 'done'
              const isSkipped = state === 'skipped'
              return (
                <div key={node.id}>
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
                    style={{
                      background: isActive ? node.color : isBlocked ? 'rgba(248,113,113,0.08)' : '#141618',
                      border: `1px solid ${isActive ? node.border : isBlocked ? 'rgba(248,113,113,0.25)' : isDone ? 'rgba(134,239,172,0.15)' : 'rgba(255,255,255,0.06)'}`,
                      opacity: isSkipped ? 0.35 : 1,
                    }}
                  >
                    <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        background: isDone ? '#86efac' : isBlocked ? '#f87171' : isActive ? (node.accent ?? '#9ca3af') : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      {(isDone || isBlocked) && (
                        <span className="text-[9px] font-bold" style={{ color: '#0b0d0e' }}>
                          {isDone ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-mono" style={{ color: isActive ? (node.accent ?? '#f5f0e8') : isBlocked ? '#f87171' : isDone ? '#86efac' : '#6b7280' }}>
                      {node.label}
                    </span>
                    {isActive && (
                      <motion.div animate={{ opacity: [1,0.3,1] }} transition={{ duration: 0.8, repeat: Infinity }}
                        className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: node.accent ?? '#9ca3af' }} />
                    )}
                  </div>
                  {i < LIFECYCLE_NODES.length - 1 && (
                    <div className="flex justify-center">
                      <div className="w-px h-2" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: log output */}
        <div className="p-5">
          <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: '#4b5563' }}>실행 로그</p>
          <div className="space-y-1.5 min-h-[160px]">
            <AnimatePresence>
              {stepIdx < 0 && (
                <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs font-mono" style={{ color: '#4b5563' }}>
                  시뮬레이션 대기 중...
                </motion.p>
              )}
              {visibleSteps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}>
                  <span className="text-[10px] font-mono mr-2" style={{ color: '#4b5563' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-xs font-mono" style={{ color: step.color }}>{step.log}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Outcome badge */}
          <AnimatePresence>
            {!running && stepIdx === sc.steps.length - 1 && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 pt-3 flex items-center gap-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-xs px-2.5 py-1 rounded-full font-mono"
                  style={{
                    background: sc.outcome === 'blocked' ? 'rgba(248,113,113,0.12)' : 'rgba(134,239,172,0.12)',
                    color: sc.outcome === 'blocked' ? '#f87171' : '#86efac',
                    border: `1px solid ${sc.outcome === 'blocked' ? 'rgba(248,113,113,0.25)' : 'rgba(134,239,172,0.25)'}`,
                  }}>
                  {sc.outcome === 'blocked' ? '✗ 실행 차단됨' : '✓ 완료'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-xs font-mono" style={{ color: '#4b5563' }}>
          {stepIdx < 0 ? '▶ 실행 버튼으로 시뮬레이션 시작' : activeStep?.label ?? ''}
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
          <button onClick={stepIdx === sc.steps.length - 1 ? reset : runDemo} disabled={running}
            className="text-xs px-3 py-1.5 rounded-lg cursor-pointer"
            style={{
              background: running ? 'rgba(217,119,87,0.1)' : '#d97757',
              color: running ? '#d97757' : '#0b0d0e',
              border: running ? '1px solid rgba(217,119,87,0.3)' : 'none',
              opacity: running ? 0.7 : 1,
            }}
          >
            {running ? '실행 중...' : stepIdx === sc.steps.length - 1 ? '다시 실행' : '▶ 실행'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Lifecycle tab content ────────────────────────────────────────────────

function LifecycleTab({ hook }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5" style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-mono mb-2" style={{ color: '#6b7280' }}>트리거 조건</p>
        <p className="text-sm leading-relaxed" style={{ color: '#f5f0e8' }}>{hook.trigger}</p>
      </div>
      <div>
        <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>활용 사례</p>
        <ul className="space-y-2">
          {hook.useCases.map((uc, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: '#9ca3af' }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#d97757' }} />
              {uc}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>종료 코드</p>
        <div className="space-y-2">
          {hook.exitCodes.map((ec, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="font-mono px-2 py-0.5 rounded text-xs flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)', color: '#d97757' }}>
                exit {ec.code}
              </span>
              <span style={{ color: '#9ca3af' }}>{ec.meaning}</span>
            </div>
          ))}
        </div>
      </div>
      {hook.env?.length > 0 && (
        <div>
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>환경 변수</p>
          <div className="flex flex-wrap gap-2">
            {hook.env.map((e) => (
              <code key={e} className="text-xs font-mono px-2 py-1 rounded" style={{ background: 'rgba(217,119,87,0.08)', color: '#d97757' }}>
                ${e}
              </code>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const capabilities = [
  { title: '명령어 차단', desc: '위험한 Bash 패턴을 실행 전에 감지하고 차단', icon: '🛡' },
  { title: '자동 포맷팅', desc: '파일 저장 시 prettier, ktlint 등 자동 실행', icon: '✨' },
  { title: '테스트 자동화', desc: '서비스 변경 시 관련 테스트 자동 실행', icon: '🧪' },
  { title: '감사 로그', desc: '모든 도구 실행 내역을 파일로 기록', icon: '📋' },
  { title: '품질 게이트', desc: 'Stop 훅으로 완료 조건 미충족 시 재실행', icon: '✅' },
  { title: '알림 전송', desc: 'Slack, Discord 등으로 완료 알림 발송', icon: '🔔' },
]

export default function HooksSection() {
  const lifecycleTabs = hookLifecycle.map((h) => ({
    id: h.name,
    label: h.name,
    content: <LifecycleTab hook={h} />,
  }))

  return (
    <section className="px-8 md:px-12 py-20 max-w-4xl mx-auto">
      <FadeInSection>
        <SectionHeader
          id="hooks"
          eyebrow="자동화의 기반"
          title="Hooks"
          accentWord="Hooks"
          subtitle="Claude가 도구를 실행하기 전후에 셸 스크립트를 실행합니다. 코드 품질 자동화, 안전 검증, 감사 로그까지 — 모든 반복 작업을 Hook으로 자동화하세요."
        />
      </FadeInSection>

      {/* Simulator */}
      <FadeInSection delay={0.06}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-2" style={{ color: '#f5f0e8' }}>동작 원리 시뮬레이터</h3>
          <p className="text-sm mb-5" style={{ color: '#6b7280' }}>
            위험한 명령어 차단 또는 파일 수정 후 자동 포맷팅 시나리오를 선택해 Hook의 실행 흐름을 확인하세요.
          </p>
          <HookSimulator />
        </div>
      </FadeInSection>

      {/* Lifecycle tabs */}
      <FadeInSection delay={0.1}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>라이프사이클 상세</h3>
          <TabSwitcher tabs={lifecycleTabs} defaultTab="PreToolUse" />
        </div>
      </FadeInSection>

      {/* Real examples */}
      <FadeInSection delay={0.14}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>
            실전 예제
            <span className="text-xs font-normal ml-2" style={{ color: '#6b7280' }}>— datagsm-server</span>
          </h3>
          <div className="space-y-3">
            <ExpandableCard title="preToolUse.sh — 위험한 명령어 차단 + 감사 로그" badge={<Badge variant="blue">PreToolUse</Badge>} defaultOpen={true}>
              <CodeBlock code={PRE_TOOL_USE_SH} language="bash" filename=".claude/hooks/preToolUse.sh" />
            </ExpandableCard>
            <ExpandableCard title="postToolUse.sh — 자동 포맷팅 및 테스트 실행" badge={<Badge variant="green">PostToolUse</Badge>}>
              <CodeBlock code={POST_TOOL_USE_SH} language="bash" filename=".claude/hooks/postToolUse.sh" />
            </ExpandableCard>
          </div>
        </div>
      </FadeInSection>

      {/* Capabilities grid */}
      <FadeInSection delay={0.18}>
        <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>Hook으로 할 수 있는 것들</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {capabilities.map((cap, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-2xl mb-3">{cap.icon}</div>
              <p className="text-sm font-medium mb-1.5" style={{ color: '#f5f0e8' }}>{cap.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{cap.desc}</p>
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  )
}
