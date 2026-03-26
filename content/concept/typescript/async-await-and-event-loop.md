---
id: "ts-con-016"
title: "TypeScript에서 async/await와 이벤트 루프"
difficulty: "mid"
category: "typescript"
type: "concept"
---

## async/await

비동기 코드를 동기 코드처럼 읽기 쉽게 작성하도록 도와주는 문법입니다.

## 본질

결국 Promise 기반 위에서 동작합니다.

## 이벤트 루프와의 연결

JavaScript/TypeScript 런타임은 단일 스레드 이벤트 루프 모델 위에서 비동기 작업을 처리합니다.

## 면접 포인트

- `async/await`는 멀티스레딩이 아니라, Promise 기반 비동기 흐름을 더 읽기 좋게 만든 것이라고 설명하면 좋습니다.
