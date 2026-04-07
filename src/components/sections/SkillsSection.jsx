import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import FadeInSection from '../ui/FadeInSection'
import CodeBlock from '../ui/CodeBlock'
import ExpandableCard from '../ui/ExpandableCard'
import TabSwitcher from '../ui/TabSwitcher'
import { SKILL_FOLDER_STRUCTURE, skillExamples, skillBenefits } from '../../data/content'

// ─── Interactive skill demo ────────────────────────────────────────────────

const DEMO_PHASES = [
  { id: 'idle',    label: '대기' },
  { id: 'trigger', label: '트리거 입력' },
  { id: 'lookup',  label: '파일 탐색' },
  { id: 'inject',  label: '컨텍스트 주입' },
  { id: 'execute', label: '실행' },
  { id: 'done',    label: '완료' },
]

const SKILL_PREVIEW = `# Commit Skill
When the user runs /commit:

1. git diff --staged 로 변경사항 분석
2. 커밋 타입 결정 (add/fix/update...)
3. 한국어 커밋 메시지 작성
4. 브랜치 생성: <type>/<desc>
5. git commit 실행`

const EXEC_STEPS = [
  { text: '$ git diff --staged', color: '#f5f0e8' },
  { text: '→ 변경 파일: src/auth/AuthService.kt', color: '#9ca3af' },
  { text: '→ 타입: fix (버그 수정 감지)', color: '#9ca3af' },
  { text: '→ 브랜치: fix/auth-token-refresh', color: '#9ca3af' },
  { text: '$ git commit -m "fix(auth): 토큰 갱신 누락 수정"', color: '#f5f0e8' },
  { text: '✓ 커밋 완료', color: '#86efac' },
]

const STEP_DELAY = 850 // ms per step

function TerminalLine({ text, delay, color }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  if (!visible) return null
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="font-mono text-xs leading-relaxed"
      style={{ color }}
    >
      {text}
    </motion.div>
  )
}

function SkillVisualizer() {
  const [phase, setPhase] = useState('idle')
  const [autoRunning, setAutoRunning] = useState(false)
  const timers = useRef([])

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const runDemo = () => {
    if (autoRunning) return
    setAutoRunning(true)
    setPhase('trigger')

    const lastStepMs = 2600 + (EXEC_STEPS.length - 1) * STEP_DELAY
    const schedule = [
      [700,             'lookup'],
      [1600,            'inject'],
      [2600,            'execute'],
      [lastStepMs + 600,'done'],
    ]
    schedule.forEach(([ms, p]) => {
      timers.current.push(setTimeout(() => setPhase(p), ms))
    })
    timers.current.push(setTimeout(() => setAutoRunning(false), lastStepMs + 900))
  }

  const reset = () => {
    clearTimers()
    setPhase('idle')
    setAutoRunning(false)
  }

  useEffect(() => () => clearTimers(), [])

  const currentIdx = DEMO_PHASES.findIndex(p => p.id === phase)

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0f1113' }}
    >
      {/* Phase progress bar */}
      <div className="flex items-stretch" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {DEMO_PHASES.map((p, i) => {
          const active = i === currentIdx
          const done = i < currentIdx
          return (
            <div
              key={p.id}
              className="flex-1 flex flex-col items-center justify-center py-2.5 px-1 text-center"
              style={{
                background: active ? 'rgba(217,119,87,0.08)' : 'transparent',
                borderRight: i < DEMO_PHASES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-all duration-300"
                style={{
                  background: done ? '#d97757' : active ? 'rgba(217,119,87,0.25)' : 'rgba(255,255,255,0.06)',
                  color: done ? '#0b0d0e' : active ? '#d97757' : '#4b5563',
                }}
              >
                {done ? '✓' : i + 1}
              </div>
              <span className="text-[10px] hidden sm:block" style={{ color: active ? '#d97757' : done ? '#9ca3af' : '#4b5563' }}>
                {p.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Main demo area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ minHeight: 240 }}>
        {/* Left: Input & file tree */}
        <div className="p-5" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: '#4b5563' }}>입력 / 파일 탐색</p>

          <div
            className="rounded-lg px-3 py-2.5 mb-4 font-mono text-sm flex items-center gap-2"
            style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span style={{ color: '#d97757' }}>❯</span>
            <AnimatePresence mode="wait">
              {phase === 'idle' ? (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#4b5563' }}>
                  명령을 입력하세요...
                </motion.span>
              ) : (
                <motion.span key="cmd" initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} style={{ color: '#f5f0e8' }}>
                  /commit
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="font-mono text-xs space-y-1" style={{ color: '#4b5563' }}>
            {[
              { path: '.claude/', indent: 0 },
              { path: 'skills/', indent: 1 },
              { path: 'commit/', indent: 2, highlight: phase !== 'idle' && phase !== 'trigger' },
              { path: 'SKILL.md', indent: 3, highlight: ['lookup','inject','execute','done'].includes(phase), file: true },
              { path: 'code-review/', indent: 2 },
              { path: 'review-pr/', indent: 2 },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1 transition-all duration-300 rounded px-1"
                style={{
                  paddingLeft: `${item.indent * 14 + 4}px`,
                  color: item.highlight ? '#d97757' : '#4b5563',
                  background: item.highlight && item.file ? 'rgba(217,119,87,0.08)' : 'transparent',
                }}
              >
                <span>{item.file ? '📄' : '📁'}</span>
                <span>{item.path}</span>
                {item.file && phase === 'lookup' && (
                  <motion.span animate={{ opacity: [0,1,0] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ color: '#d97757' }}>
                    {' '}← 로드 중
                  </motion.span>
                )}
                {item.file && ['inject','execute','done'].includes(phase) && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#86efac' }}>{' '}✓ 로드됨</motion.span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Context / execution */}
        <div className="p-5">
          <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: '#4b5563' }}>
            {['execute','done'].includes(phase) ? '실행 결과' : 'SKILL.md → 컨텍스트 주입'}
          </p>
          <AnimatePresence mode="wait">
            {(phase === 'idle' || phase === 'trigger') && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-xs font-mono" style={{ color: '#4b5563' }}>
                파일을 탐색하는 중...
              </motion.div>
            )}
            {phase === 'inject' && (
              <motion.div key="inject" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="text-xs font-mono leading-relaxed whitespace-pre" style={{ color: '#9ca3af' }}>
                {SKILL_PREVIEW}
              </motion.div>
            )}
            {['execute','done'].includes(phase) && (
              <motion.div key="exec" className="space-y-1">
                {EXEC_STEPS.map((step, i) => (
                  <TerminalLine key={i} text={step.text} delay={i * STEP_DELAY} color={step.color} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-xs font-mono" style={{ color: '#4b5563' }}>
          {phase === 'idle' ? '▶ 실행 버튼을 눌러 시뮬레이션 시작' : DEMO_PHASES[currentIdx]?.label}
        </span>
        <div className="flex gap-2">
          {phase !== 'idle' && (
            <button onClick={reset}
              className="text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
              style={{ color: '#6b7280', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#9ca3af'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            >
              초기화
            </button>
          )}
          <div className="relative">
            {phase === 'idle' && (
              <span className="absolute inset-0 rounded-lg animate-ping"
                style={{ background: 'rgba(217,119,87,0.35)', animationDuration: '2s' }} />
            )}
            <button onClick={phase === 'done' ? reset || runDemo : runDemo} disabled={autoRunning}
              className="relative text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all"
              style={{
                background: autoRunning ? 'rgba(217,119,87,0.1)' : '#d97757',
                color: autoRunning ? '#d97757' : '#0b0d0e',
                border: autoRunning ? '1px solid rgba(217,119,87,0.3)' : 'none',
                opacity: autoRunning ? 0.7 : 1,
              }}
            >
              {autoRunning ? '실행 중...' : phase === 'done' ? '다시 실행' : '▶ 실행'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section component ─────────────────────────────────────────────────────

export default function SkillsSection() {
  const skillTabs = skillExamples.map((skill) => ({
    id: skill.name,
    label: skill.trigger,
    content: <CodeBlock code={skill.code} language="markdown" filename={skill.file} />,
  }))

  return (
    <section className="px-8 md:px-12 py-20 max-w-4xl mx-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <FadeInSection>
        <SectionHeader
          id="skills"
          eyebrow="재사용 가능한 워크플로우"
          title="Skills"
          accentWord="Skills"
          subtitle="슬래시 커맨드로 복잡한 다단계 작업을 캡슐화합니다. /commit 한 번으로 변경사항 분석 → 커밋 메시지 생성 → 브랜치 관리까지 자동화하세요."
        />
      </FadeInSection>

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
            트리거 입력 → SKILL.md 파일 탐색 → 컨텍스트 주입 → 단계별 실행의 흐름을 직접 확인해보세요.
          </p>
          <SkillVisualizer />
        </div>
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>폴더 구조</h3>
          <CodeBlock code={SKILL_FOLDER_STRUCTURE} language="text" filename=".claude/skills/" />
        </div>
      </FadeInSection>

      <FadeInSection delay={0.14}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-2" style={{ color: '#f5f0e8' }}>
            실전 예제
            <span className="text-xs font-normal ml-2" style={{ color: '#6b7280' }}>— datagsm-server</span>
          </h3>
          <p className="text-sm mb-5" style={{ color: '#6b7280' }}>각 SKILL.md 파일은 트리거 조건과 수행 단계를 자연어로 정의합니다.</p>
          <TabSwitcher tabs={skillTabs} />
        </div>
      </FadeInSection>

      <FadeInSection delay={0.18}>
        <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>왜 Skill인가</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skillBenefits.map((b, i) => (
            <div key={i} className="rounded-xl p-4 flex gap-3"
              style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-1.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: '#d97757', minHeight: '100%', alignSelf: 'stretch' }} />
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#f5f0e8' }}>{b.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  )
}
