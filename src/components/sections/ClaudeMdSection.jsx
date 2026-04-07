import SectionHeader from '../ui/SectionHeader'
import FadeInSection from '../ui/FadeInSection'
import CodeBlock from '../ui/CodeBlock'
import ExpandableCard from '../ui/ExpandableCard'
import { CLAUDE_MD_TEMPLATE, claudeMdSections } from '../../data/content'

function LengthGuide() {
  const zones = [
    { label: '최적', range: '50–70줄', pct: 44, color: '#86efac', from: 0, width: 44 },
    { label: '허용', range: '71–160줄', pct: 56, color: '#fde68a', from: 44, width: 35 },
    { label: '초과', range: '160줄+', pct: 0, color: '#f87171', from: 79, width: 21 },
  ]

  return (
    <div className="rounded-xl p-5" style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: '#6b7280' }}>권장 길이</p>
      <div className="h-2.5 rounded-full overflow-hidden flex mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ width: '44%', background: '#86efac', borderRadius: '99px 0 0 99px' }} />
        <div style={{ width: '35%', background: '#fde68a' }} />
        <div style={{ width: '21%', background: '#f87171', borderRadius: '0 99px 99px 0' }} />
      </div>
      <div className="flex gap-4 flex-wrap">
        {[
          { label: '최적', range: '50–70줄', color: '#86efac' },
          { label: '허용', range: '71–160줄', color: '#fde68a' },
          { label: '초과 금지', range: '160줄+', color: '#f87171' },
        ].map((z) => (
          <div key={z.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: z.color }} />
            <span className="text-xs" style={{ color: '#9ca3af' }}>
              <span style={{ color: z.color }}>{z.label}</span> {z.range}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs mt-4 leading-relaxed" style={{ color: '#6b7280' }}>
        CLAUDE.md가 너무 길면 Claude의 집중도가 분산됩니다. 세부 규칙은 <code style={{ color: '#d97757', background: 'rgba(217,119,87,0.08)', padding: '1px 6px', borderRadius: 4 }}>.claude/rules/*.md</code>로 분리하고, CLAUDE.md에선 참조만 하세요.
      </p>
    </div>
  )
}

function HierarchyDiagram() {
  const levels = [
    { label: 'user', path: '~/.claude/CLAUDE.md', desc: '전역 개인 설정', badge: '낮음' },
    { label: 'sub-folder', path: 'src/CLAUDE.md', desc: '모듈별 특화 지침', badge: '중간' },
    { label: 'project', path: 'CLAUDE.md', desc: '프로젝트 메인 컨텍스트', badge: '높음', accent: true },
  ]

  return (
    <div className="space-y-2">
      {levels.map((lv, i) => (
        <div
          key={lv.label}
          className="flex items-center gap-4 rounded-xl px-5 py-4"
          style={{
            background: lv.accent ? 'rgba(217,119,87,0.07)' : '#141618',
            border: `1px solid ${lv.accent ? 'rgba(217,119,87,0.25)' : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          <div
            className="text-xs font-mono px-2 py-0.5 rounded flex-shrink-0"
            style={{
              background: lv.accent ? 'rgba(217,119,87,0.15)' : 'rgba(255,255,255,0.05)',
              color: lv.accent ? '#d97757' : '#6b7280',
            }}
          >
            {lv.badge}
          </div>
          <div className="flex-1 min-w-0">
            <code className="text-sm" style={{ color: lv.accent ? '#d97757' : '#f5f0e8' }}>{lv.path}</code>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{lv.desc}</p>
          </div>
          {i < levels.length - 1 && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
              <path d="M8 3v10M5 10l3 3 3-3" stroke="#4b5563" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      ))}
      <p className="text-xs px-1 pt-1" style={{ color: '#4b5563' }}>
        ↑ 우선순위 순서. project CLAUDE.md가 user 설정을 덮어씁니다.
      </p>
    </div>
  )
}

export default function ClaudeMdSection() {
  return (
    <section
      className="px-8 md:px-12 py-20 max-w-4xl mx-auto"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <FadeInSection>
        <SectionHeader
          id="claude-md"
          eyebrow="프로젝트 컨텍스트"
          title="CLAUDE.md"
          accentWord="CLAUDE.md"
          subtitle="Claude가 프로젝트를 이해하기 위한 핵심 문서입니다. 아키텍처, 컨벤션, 금지 사항을 명시하여 Claude가 매 대화마다 팀 규칙을 재학습하지 않도록 합니다."
        />
      </FadeInSection>

      {/* Length guide */}
      <FadeInSection delay={0.06}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>적정 길이</h3>
          <LengthGuide />
        </div>
      </FadeInSection>

      {/* Hierarchy */}
      <FadeInSection delay={0.1}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>적용 계층</h3>
          <HierarchyDiagram />
        </div>
      </FadeInSection>

      {/* What to include */}
      <FadeInSection delay={0.14}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>포함해야 할 내용</h3>
          <div className="space-y-2.5">
            {claudeMdSections.map((sec, i) => (
              <FadeInSection key={i} delay={0.14 + i * 0.05}>
                <div
                  className="flex gap-4 rounded-xl p-4"
                  style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(217,119,87,0.15)', color: '#d97757' }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: '#f5f0e8' }}>{sec.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{sec.why}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* Template */}
      <FadeInSection delay={0.18}>
        <ExpandableCard title="권장 CLAUDE.md 구조 템플릿" defaultOpen={false}>
          <CodeBlock code={CLAUDE_MD_TEMPLATE} language="markdown" filename="CLAUDE.md" />
        </ExpandableCard>
      </FadeInSection>
    </section>
  )
}
