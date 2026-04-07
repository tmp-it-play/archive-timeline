# Claude Code 하네스 꾸미기

**datagsm-server 레포지터리로 보는 Claude Code 하네스 꾸미기** — Hook, Skill, Sub-Agent, CLAUDE.md, Context Window, settings.json을 실전 예시와 함께 설명하는 인터랙티브 가이드 사이트.

🔗 **[라이브 사이트 보기 →](https://claude-code-harness.vercel.app)**

## 다루는 내용

| 개념 | 설명 |
|------|------|
| **Hooks** | PreToolUse / PostToolUse 라이프사이클 + 자동화 예제 |
| **Skills** | 슬래시 커맨드 동작 원리 시각화 + 실전 SKILL.md 예제 |
| **CLAUDE.md** | 적정 길이 가이드, 계층 구조, 템플릿 |
| **Context Window** | 토큰 예산 시각화, 개념별 최적화 전략 |
| **Sub-Agents** | SRP 원칙 적용, Software 1.0 vs 3.0 비교 |
| **settings.json** | permissions, hooks 연결, effortLevel 가이드 |

모든 예시는 [themoment-team/datagsm-server](https://github.com/themoment-team/datagsm-server) 레포지터리의 실제 설정을 기반으로 합니다.

## 기술 스택

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Framer Motion** — 인터랙션 및 애니메이션
- **react-syntax-highlighter** — 코드 블록 구문 강조

## 로컬 실행

```bash
pnpm install
pnpm dev
```

> npm 대신 pnpm을 사용합니다 (npm v10.9.2 arborist 버그 우회).

## 배포

Vercel에 자동 배포됩니다. `main` 브랜치 푸시 시 자동 배포.

```bash
pnpm build   # 프로덕션 빌드
pnpm preview # 빌드 결과 로컬 미리보기
```

## 라이선스

[MIT](LICENSE) © 2025 snowykte0426
