---
id: "ds-con-007"
title: "동적 프로그래밍에서 Top-down과 Bottom-up 선택"
difficulty: "mid"
category: "data_structure"
type: "concept"
---

## Top-down

- 재귀 + 메모이제이션
- 문제를 필요한 만큼만 풂
- 구현이 직관적일 수 있음

## Bottom-up

- 작은 문제부터 테이블을 채움
- 반복문 기반
- 호출 오버헤드가 적고 스택 오버플로 걱정이 적음

## 선택 기준

### Top-down이 좋은 경우
- 점화식이 자연스럽게 재귀로 떠오름
- 실제로 필요한 상태 수가 적음

### Bottom-up이 좋은 경우
- 상태 공간을 명확히 순회 가능
- 성능과 메모리 제어가 더 중요함

## 면접 포인트

- 둘 다 DP지만, 구현 스타일과 성능 특성이 다르다고 설명하면 좋습니다.
