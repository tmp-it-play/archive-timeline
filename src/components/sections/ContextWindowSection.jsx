import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import FadeInSection from '../ui/FadeInSection'
import { contextBudgetItems, contextTips, contextWindowFacts } from '../../data/content'

// ─── Token budget visualizer ───────────────────────────────────────────────

function TokenBudget() {
  const [hovered, setHovered] = useState(null)
  const total = contextBudgetItems.reduce((s, i) => s + i.tokens, 0)

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono uppercase tracking-wider" style={{ color: '#6b7280' }}>
          컨텍스트 윈도우 토큰 배분 (예시)
        </p>
        <span className="text-xs font-mono" style={{ color: '#4b5563' }}>{total.toLocaleString()} / 200,000 tokens</span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-8 rounded-lg overflow-hidden mb-5 gap-0.5">
        {contextBudgetItems.map((item) => (
          <motion.div
            key={item.label}
            className="relative cursor-pointer transition-all duration-150"
            style={{
              width: `${item.pct}%`,
              background: item.color,
              opacity: hovered === null || hovered === item.label ? 1 : 0.3,
            }}
            onMouseEnter={() => setHovered(item.label)}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scaleY: 1.08 }}
          />
        ))}
        {/* Remaining space */}
        <div
          className="flex-1 rounded-r-lg"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.1)' }}
        />
      </div>

      {/* Legend — gap 없이 연속 hover 영역 */}
      <div>
        {contextBudgetItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-150"
            style={{
              background: hovered === item.label ? 'rgba(255,255,255,0.04)' : 'transparent',
              borderRadius: 8,
            }}
            onMouseEnter={() => setHovered(item.label)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }} />
            <span className="text-sm flex-1" style={{ color: '#f5f0e8' }}>{item.label}</span>
            <span className="text-xs font-mono" style={{ color: '#6b7280' }}>{item.tokens.toLocaleString()} tokens</span>
            <span className="text-xs font-mono w-8 text-right" style={{ color: item.color }}>{item.pct}%</span>
          </div>
        ))}
        <div className="flex items-center gap-3 px-3 py-2.5">
          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)', border: '1px dashed rgba(255,255,255,0.2)' }} />
          <span className="text-sm flex-1" style={{ color: '#4b5563' }}>나머지 여유 공간</span>
          <span className="text-xs font-mono" style={{ color: '#4b5563' }}>{(200000 - total).toLocaleString()} tokens</span>
          <span className="text-xs font-mono w-8 text-right" style={{ color: '#4b5563' }}>{(100 - contextBudgetItems.reduce((s, i) => s + i.pct, 0))}%</span>
        </div>
      </div>

      {/* Hover detail */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#9ca3af' }}
        >
          {contextBudgetItems.find(i => i.label === hovered)?.desc}
        </motion.div>
      )}
    </div>
  )
}

// ─── Concept tips cards ────────────────────────────────────────────────────

function TipCard({ tip, delay }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <FadeInSection delay={delay}>
      <div
        className="rounded-xl transition-all duration-200"
        style={{
          background: expanded ? 'rgba(255,255,255,0.04)' : '#141618',
          border: `1px solid ${expanded ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
        }}
      >
        {/* 헤더만 클릭 토글 — 내부 텍스트 드래그해도 닫히지 않음 */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{tip.icon}</span>
            <div>
              <span className="text-sm font-mono" style={{ color: '#d97757' }}>{tip.concept}</span>
              <span
                className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-mono"
                style={{ background: `${tip.impactColor}18`, color: tip.impactColor }}
              >
                {tip.impact}
              </span>
            </div>
          </div>
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}
          >
            <path d="M3 5l4 4 4-4" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4 space-y-3"
          >
            <div className="rounded-lg p-3" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.12)' }}>
              <p className="text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: '#f87171' }}>문제</p>
              <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>{tip.problem}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: `${tip.impactColor}08`, border: `1px solid ${tip.impactColor}20` }}>
              <p className="text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: tip.impactColor }}>해결</p>
              <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>{tip.solution}</p>
            </div>
          </motion.div>
        )}
      </div>
    </FadeInSection>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────

export default function ContextWindowSection() {
  return (
    <section
      className="px-8 md:px-12 py-20 max-w-4xl mx-auto"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <FadeInSection>
        <SectionHeader
          id="context-window"
          eyebrow="토큰 예산 관리"
          title="Context Window"
          accentWord="Context Window"
          subtitle="Claude가 한 번에 처리할 수 있는 텍스트의 최대량입니다. 모든 Hook·Skill·Sub-Agent 설계는 궁극적으로 이 토큰 예산을 효율적으로 쓰기 위한 것입니다."
        />
      </FadeInSection>

      {/* Stats row */}
      <FadeInSection delay={0.06}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {contextWindowFacts.map((fact, i) => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="text-3xl font-bold mb-1" style={{ color: '#d97757' }}>{fact.stat}</p>
              <p className="text-sm font-medium mb-2" style={{ color: '#f5f0e8' }}>{fact.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{fact.desc}</p>
            </div>
          ))}
        </div>
      </FadeInSection>

      {/* Token budget */}
      <FadeInSection delay={0.1}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>토큰 예산 시각화</h3>
          <TokenBudget />
        </div>
      </FadeInSection>

      {/* How context flows */}
      <FadeInSection delay={0.14}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>컨텍스트가 쌓이는 방식</h3>
          <div
            className="rounded-xl p-5"
            style={{ background: '#141618', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="space-y-3">
              {[
                { turn: '대화 시작', added: 'System Prompt + CLAUDE.md', tokens: '~14,000', color: '#7dd3fc' },
                { turn: '첫 번째 요청', added: '사용자 메시지 + 파일 읽기 결과', tokens: '~8,000 추가', color: '#d97757' },
                { turn: '두 번째 요청', added: '이전 대화 전체 + 새 메시지 + 도구 결과', tokens: '~24,000 추가', color: '#fde68a' },
                { turn: '열 번째 요청', added: '누적 대화 히스토리가 지배적', tokens: '~80,000+', color: '#f87171' },
              ].map((row, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-24">
                    <span className="text-xs font-mono" style={{ color: '#6b7280' }}>{row.turn}</span>
                  </div>
                  <div className="flex-1 flex items-start justify-between gap-2">
                    <span className="text-xs" style={{ color: '#9ca3af' }}>{row.added}</span>
                    <span className="text-xs font-mono flex-shrink-0" style={{ color: row.color }}>{row.tokens}</span>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-4 pt-4 text-xs leading-relaxed"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#6b7280' }}
            >
              💡 컨텍스트 창이 가득 차면 Claude Code가 자동으로 오래된 메시지를 압축(summarize)합니다. 이때 중요한 코드 맥락이 손실될 수 있습니다.
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Per-concept tips */}
      <FadeInSection delay={0.18}>
        <div>
          <h3 className="text-base font-semibold mb-2" style={{ color: '#f5f0e8' }}>개념별 컨텍스트 최적화 전략</h3>
          <p className="text-sm mb-5" style={{ color: '#6b7280' }}>각 카드를 클릭해 문제와 해결책을 확인하세요.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contextTips.map((tip, i) => (
              <TipCard key={tip.concept} tip={tip} delay={0.18 + i * 0.05} />
            ))}
          </div>
        </div>
      </FadeInSection>
    </section>
  )
}
