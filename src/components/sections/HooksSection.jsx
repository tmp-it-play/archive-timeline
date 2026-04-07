import SectionHeader from '../ui/SectionHeader'
import FadeInSection from '../ui/FadeInSection'
import CodeBlock from '../ui/CodeBlock'
import ExpandableCard from '../ui/ExpandableCard'
import TabSwitcher from '../ui/TabSwitcher'
import Badge from '../ui/Badge'
import {
  PRE_TOOL_USE_SH,
  POST_TOOL_USE_SH,
  hookLifecycle,
} from '../../data/content'

const badgeVariants = {
  PreToolUse: 'blue',
  PostToolUse: 'green',
  Stop: 'orange',
  SubagentStop: 'purple',
  Notification: 'default',
}

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

      {/* Lifecycle */}
      <FadeInSection delay={0.08}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>라이프사이클</h3>
          <TabSwitcher tabs={lifecycleTabs} defaultTab="PreToolUse" />
        </div>
      </FadeInSection>

      {/* Real examples */}
      <FadeInSection delay={0.12}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>
            실전 예제
            <span className="text-xs font-normal ml-2" style={{ color: '#6b7280' }}>— datagsm-server</span>
          </h3>
          <div className="space-y-3">
            <ExpandableCard
              title="preToolUse.sh — 위험한 명령어 차단 + 감사 로그"
              badge={<Badge variant="blue">PreToolUse</Badge>}
              defaultOpen={true}
            >
              <CodeBlock code={PRE_TOOL_USE_SH} language="bash" filename=".claude/hooks/preToolUse.sh" />
            </ExpandableCard>
            <ExpandableCard
              title="postToolUse.sh — 자동 포맷팅 및 테스트 실행"
              badge={<Badge variant="green">PostToolUse</Badge>}
            >
              <CodeBlock code={POST_TOOL_USE_SH} language="bash" filename=".claude/hooks/postToolUse.sh" />
            </ExpandableCard>
          </div>
        </div>
      </FadeInSection>

      {/* Capabilities grid */}
      <FadeInSection delay={0.16}>
        <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>Hook으로 할 수 있는 것들</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {capabilities.map((cap, i) => (
            <div
              key={i}
              className="rounded-xl p-4"
              style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}
            >
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
