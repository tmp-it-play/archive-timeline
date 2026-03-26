---
id: "ts-con-020"
title: "TypeScript 백엔드에서 에러 처리를 어떻게 볼까"
difficulty: "mid"
category: "typescript"
type: "concept"
---

## 왜 중요한가?

비동기 코드, 외부 API, DB 연동이 많아질수록 에러 처리가 서비스 안정성에 직접 연결됩니다.

## 자주 보는 방식

- `try/catch`
- 공통 에러 핸들러
- 커스텀 에러 클래스
- 에러 응답 표준화

## 면접 포인트

- 에러 처리는 단순 예외 잡기가 아니라, 로그/응답/복구 전략까지 포함한다고 설명하면 좋습니다.
