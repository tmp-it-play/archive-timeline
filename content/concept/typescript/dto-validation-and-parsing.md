---
id: "ts-con-019"
title: "TypeScript 백엔드에서 DTO 검증이 왜 필요할까"
difficulty: "mid"
category: "typescript"
type: "concept"
---

## 타입만 있으면 충분한가?

아닙니다.
TypeScript 타입은 주로 컴파일 타임에만 의미가 있습니다.

## 왜 검증이 필요한가?

외부에서 들어오는 요청은 런타임 데이터이기 때문입니다.

예:
- HTTP body
- query string
- path parameter

## 실무에서 하는 일

- DTO 정의
- 런타임 검증
- 파싱/변환

## 면접 포인트

- "타입이 있으니 검증 필요 없다"는 말은 틀렸다고 설명할 수 있어야 합니다.
