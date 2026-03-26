---
id: "ai-mcq-006"
title: "Claude Code의 Hook 중 도구 실행을 사전에 차단(Block)할 수 있는 것은?"
difficulty: "mid"
category: "ai_dev"
type: "mcq"
options:
  - text: "PreToolUse"
    correct: true
  - text: "PostToolUse"
    correct: false
  - text: "Stop"
    correct: false
  - text: "Notification"
    correct: false
---

Claude Code의 Hooks는 이벤트 기반으로 동작합니다.
- **PreToolUse**: 도구 실행 직전에 실행되며, 훅이 non-zero를 반환하면 도구 실행을 **차단**할 수 있습니다.
- **PostToolUse**: 도구 실행 후 실행됩니다. 차단은 불가능합니다.
- **Stop**: Claude가 응답을 완료할 때 실행됩니다.
- **Notification**: Claude가 사용자에게 알림을 보낼 때 실행됩니다.
