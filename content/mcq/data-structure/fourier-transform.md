---
id: "ds-mcq-016"
title: "DFT와 FFT의 시간 복잡도 차이로 올바른 것은?"
difficulty: "mid"
category: "data_structure"
type: "mcq"
options:
  - text: "DFT는 O(N²)이고, FFT는 분할 정복을 통해 O(N log N)으로 줄인다."
    correct: true
  - text: "DFT는 O(N log N)이고, FFT는 O(N²)이다."
    correct: false
  - text: "FFT는 DFT와 결과가 다르며, 근사값을 반환한다."
    correct: false
  - text: "FFT는 N이 소수일 때만 동작한다."
    correct: false
---

DFT는 N개의 출력 각각에 N번 연산하므로 O(N²)입니다. FFT는 Cooley-Tukey 방식으로 짝수/홀수 항으로 재귀 분할하여 O(N log N)을 달성합니다. 결과는 동일하며 근사가 아닙니다.
