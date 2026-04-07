import SectionHeader from '../ui/SectionHeader'
import FadeInSection from '../ui/FadeInSection'
import CodeBlock from '../ui/CodeBlock'
import ExpandableCard from '../ui/ExpandableCard'
import { SETTINGS_JSON, settingsOptions, effortLevels } from '../../data/content'

const PERMISSIONS_EXAMPLE = `// ✅ 안전한 패턴 — 특정 명령어만 허용
{
  "permissions": {
    "allow": [
      "Bash(git *)",          // git 명령 전부 허용
      "Bash(./gradlew *)",    // Gradle 빌드 허용
      "WebSearch",            // 웹 검색 허용
      "WebFetch"              // 웹 페이지 조회 허용
    ],
    "deny": [
      "Bash(git push*)",      // push는 수동으로만
      "Bash(rm -rf*)"         // 재귀 삭제 차단
    ]
  }
}`.trim()

export default function SettingsSection() {
  return (
    <section
      className="px-8 md:px-12 py-20 max-w-4xl mx-auto"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <FadeInSection>
        <SectionHeader
          id="settings"
          eyebrow="프로젝트 설정"
          title="settings.json"
          accentWord="settings.json"
          subtitle="Claude Code의 동작을 세밀하게 제어합니다. 권한 관리, Hook 연결, 응답 언어, 노력 수준까지 — 팀에 맞게 최적화하세요."
        />
      </FadeInSection>

      {/* Full example */}
      <FadeInSection delay={0.06}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>
            전체 예시
            <span className="text-xs font-normal ml-2" style={{ color: '#6b7280' }}>— datagsm-server</span>
          </h3>
          <CodeBlock code={SETTINGS_JSON} language="json" filename=".claude/settings.json" />
        </div>
      </FadeInSection>

      {/* Options reference */}
      <FadeInSection delay={0.1}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>옵션 설명</h3>
          <div className="space-y-0 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {settingsOptions.map((opt, i) => (
              <div
                key={opt.key}
                className="flex flex-col sm:flex-row gap-3 px-5 py-4"
                style={{
                  background: i % 2 === 0 ? '#141618' : '#161a1c',
                  borderBottom: i < settingsOptions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                <div className="sm:w-52 flex-shrink-0">
                  <code className="text-sm font-mono block mb-1" style={{ color: '#d97757' }}>{opt.key}</code>
                  <span className="text-xs font-mono" style={{ color: '#4b5563' }}>{opt.type}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* Permissions example */}
      <FadeInSection delay={0.14}>
        <div className="mb-10">
          <ExpandableCard title="permissions 패턴 예시 — allow / deny 조합" defaultOpen={false}>
            <CodeBlock code={PERMISSIONS_EXAMPLE} language="javascript" />
          </ExpandableCard>
        </div>
      </FadeInSection>

      {/* effortLevel guide */}
      <FadeInSection delay={0.18}>
        <div className="mb-10">
          <h3 className="text-base font-semibold mb-5" style={{ color: '#f5f0e8' }}>effortLevel 선택 가이드</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {effortLevels.map((el) => (
              <div
                key={el.level}
                className="rounded-xl p-5"
                style={{
                  background: el.recommended ? 'rgba(217,119,87,0.06)' : '#141618',
                  border: `1px solid ${el.recommended ? 'rgba(217,119,87,0.2)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-mono" style={{ color: el.recommended ? '#d97757' : '#f5f0e8' }}>
                    "{el.level}"
                  </code>
                  {el.recommended && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(217,119,87,0.15)', color: '#d97757' }}>
                      권장
                    </span>
                  )}
                </div>
                <p className="text-xs mb-3" style={{ color: '#6b7280' }}>{el.desc}</p>
                <ul className="space-y-1.5">
                  {el.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: el.recommended ? '#d97757' : '#4b5563' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* Footer CTA */}
      <FadeInSection delay={0.22}>
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: 'rgba(217,119,87,0.04)', border: '1px solid rgba(217,119,87,0.12)' }}
        >
          <p className="text-2xl font-bold mb-2" style={{ color: '#f5f0e8' }}>
            이제 직접 구성해보세요
          </p>
          <p className="text-sm leading-relaxed mb-6 max-w-md mx-auto" style={{ color: '#9ca3af' }}>
            CLAUDE.md로 프로젝트를 설명하고, Hook으로 자동화하고, Skill로 워크플로우를 캡슐화하고, Sub-Agent로 전문화하세요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['.claude/', 'hooks/', 'skills/', 'agents/', 'CLAUDE.md', 'settings.json'].map((f) => (
              <code
                key={f}
                className="text-xs font-mono px-3 py-1.5 rounded-lg"
                style={{ color: '#9ca3af', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {f}
              </code>
            ))}
          </div>
        </div>
      </FadeInSection>
    </section>
  )
}
