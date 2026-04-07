import SectionHeader from '../ui/SectionHeader'
import FadeInSection from '../ui/FadeInSection'
import CodeBlock from '../ui/CodeBlock'
import ExpandableCard from '../ui/ExpandableCard'
import TabSwitcher from '../ui/TabSwitcher'
import Badge from '../ui/Badge'
import {
  softwareEras,
  TEST_FIXER_AGENT,
  CONVENTION_VALIDATOR_AGENT,
  agentBenefits,
} from '../../data/content'

function EraCard({ era }) {
  return (
    <div
      className="rounded-xl p-5 h-full"
      style={{
        background: era.accent ? 'rgba(217,119,87,0.05)' : '#141618',
        border: `1px solid ${era.accent ? 'rgba(217,119,87,0.2)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
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

function AgentFlowDiagram() {
  const nodes = [
    { label: '사용자', sub: '"테스트 고쳐줘"' },
    { label: 'Claude', sub: '에이전트 선택' },
    { label: 'Sub-Agent', sub: 'test-fixer', accent: true },
    { label: '결과', sub: '수정 + 보고' },
  ]

  return (
    <div
      className="rounded-xl p-6"
      style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {nodes.map((node, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-2 text-sm font-medium"
                style={{
                  background: node.accent ? 'rgba(217,119,87,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${node.accent ? 'rgba(217,119,87,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  color: node.accent ? '#d97757' : '#f5f0e8',
                }}
              >
                {node.label}
              </div>
              <p className="text-xs max-w-[80px]" style={{ color: '#6b7280' }}>{node.sub}</p>
            </div>
            {i < nodes.length - 1 && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 -mt-6 hidden sm:block">
                <path d="M5 10h10M12 7l3 3-3 3" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs mt-5 pt-4 text-center leading-relaxed" style={{ color: '#4b5563', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        Sub-Agent는 독립된 컨텍스트 창에서 실행 — 메인 대화를 오염시키지 않습니다
      </p>
    </div>
  )
}

export default function SubAgentsSection() {
  const eraTabs = softwareEras.map((era) => ({
    id: era.era,
    label: era.era,
    content: <EraCard era={era} />,
  }))

  return (
    <section
      className="px-8 md:px-12 py-20 max-w-4xl mx-auto"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <FadeInSection>
        <SectionHeader
          id="sub-agents"
          eyebrow="전문화된 실행자"
          title="Sub-Agents"
          accentWord="Sub-Agents"
          subtitle="단일 책임 원칙(SRP)을 AI에 적용합니다. 각 에이전트는 하나의 전문 역할만 수행하여 집중력과 재사용성을 극대화합니다."
        />
      </FadeInSection>

      {/* Software eras */}
      <FadeInSection delay={0.06}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>
            Software 1.0 vs 3.0
          </h3>
          <TabSwitcher tabs={eraTabs} defaultTab="Software 1.0" />
        </div>
      </FadeInSection>

      {/* Flow diagram */}
      <FadeInSection delay={0.1}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>동작 원리</h3>
          <AgentFlowDiagram />
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
            <ExpandableCard
              title="test-fixer.md — Kotlin 테스트 자동 수정"
              badge={<Badge variant="green">agents</Badge>}
              defaultOpen={true}
            >
              <CodeBlock code={TEST_FIXER_AGENT} language="markdown" filename=".claude/agents/test-fixer.md" />
            </ExpandableCard>
            <ExpandableCard
              title="convention-validator.md — 코드 컨벤션 자동 검증"
              badge={<Badge variant="blue">agents</Badge>}
            >
              <CodeBlock code={CONVENTION_VALIDATOR_AGENT} language="markdown" filename=".claude/agents/convention-validator.md" />
            </ExpandableCard>
          </div>
        </div>
      </FadeInSection>

      {/* SRP callout */}
      <FadeInSection delay={0.18}>
        <div className="mb-10">
          <aside
            className="rounded-xl p-5"
            style={{
              background: 'rgba(217,119,87,0.04)',
              border: '1px solid rgba(217,119,87,0.15)',
              borderLeft: '3px solid #d97757',
            }}
          >
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
            <div
              key={i}
              className="rounded-xl p-4"
              style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="text-sm font-medium mb-1.5" style={{ color: '#f5f0e8' }}>{b.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  )
}
