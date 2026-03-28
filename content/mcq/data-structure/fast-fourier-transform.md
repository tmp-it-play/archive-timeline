---
id: "ds-mcq-017"
title: "Cooley-Tukey FFT 알고리즘의 핵심 원리로 가장 적절한 것은?"
difficulty: "senior"
category: "data_structure"
type: "mcq"
options:
  - text: "N-포인트 DFT를 짝수/홀수 인덱스의 N/2-포인트 DFT 두 개로 재귀 분할하고, 회전 인수(twiddle factor)로 합산한다."
    correct: true
  - text: "입력 배열을 정렬한 뒤 이진 탐색으로 주파수 성분을 추출한다."
    correct: false
  - text: "다이나믹 프로그래밍으로 이전 주파수 계산 결과를 메모이제이션한다."
    correct: false
  - text: "해시 테이블을 이용해 중복 주파수 성분을 제거한다."
    correct: false
---

Cooley-Tukey FFT는 N-포인트 DFT를 짝수/홀수 인덱스 절반씩 재귀 분할합니다. 각 레벨에서 회전 인수(e^(-i·2π·k/N)) 를 이용해 두 절반의 결과를 버터플라이 연산으로 합산하며, 재귀 깊이 log N × 레벨당 O(N) = 전체 O(N log N) 을 달성합니다.
