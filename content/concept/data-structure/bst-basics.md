---
id: "ds-con-009"
title: "BST(이진 탐색 트리) 기본 개념"
difficulty: "junior"
category: "data_structure"
type: "concept"
---

## BST란?

이진 트리의 한 종류로, 각 노드에 대해

- 왼쪽 서브트리의 값은 현재 노드보다 작고
- 오른쪽 서브트리의 값은 현재 노드보다 큽니다.

## 장점

- 평균적으로 탐색, 삽입, 삭제가 `O(log n)`
- 정렬된 순회(in-order traversal)가 가능

## 단점

- 한쪽으로 치우치면 최악 `O(n)`
- 그래서 실제 구현에서는 균형 트리가 자주 사용됨

## 면접 포인트

- BST 자체보다 "왜 균형 트리가 필요한가"까지 연결해서 설명하면 좋습니다.
