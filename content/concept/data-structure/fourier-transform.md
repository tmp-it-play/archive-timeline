---
id: "ds-con-023"
title: "푸리에 변환(DFT)과 고속 푸리에 변환(FFT)"
difficulty: "senior"
category: "data_structure"
type: "concept"
---

## 푸리에 변환이란

신호를 **시간(공간) 도메인**에서 **주파수 도메인**으로 변환하는 수학적 기법입니다.
어떤 복잡한 신호도 여러 주파수의 사인/코사인 합으로 분해할 수 있다는 아이디어에서 출발합니다.

알고리즘에서는 주로 **이산 푸리에 변환(DFT)** 을 사용합니다.

## DFT (이산 푸리에 변환)

길이 N인 수열 x[0..N-1]에 대해 k번째 주파수 성분 X[k]를 구합니다.

```
X[k] = Σ (n=0..N-1) x[n] · e^(-i·2π·k·n/N)
```

- 시간 복잡도: **O(N²)** — N개의 출력 각각에 N번 연산
- N이 크면 너무 느려서 실용적이지 않습니다.

## FFT (고속 푸리에 변환)

DFT를 **O(N log N)** 으로 줄이는 알고리즘입니다.
가장 널리 쓰이는 구현은 **Cooley-Tukey 알고리즘**입니다.

### 핵심 아이디어: 분할 정복

N이 2의 거듭제곱일 때, DFT를 짝수 인덱스 부분과 홀수 인덱스 부분으로 재귀 분할합니다.

```
X[k] = DFT(짝수 항)[k] + W_N^k · DFT(홀수 항)[k]
X[k+N/2] = DFT(짝수 항)[k] - W_N^k · DFT(홀수 항)[k]

W_N^k = e^(-i·2π·k/N)  ← 회전 인수(twiddle factor)
```

- N/2짜리 DFT 두 개로 쪼개고, 이를 재귀 적용 → 깊이 log N
- 각 레벨에서 O(N) 연산 → 전체 **O(N log N)**

### 버터플라이 다이어그램

FFT 연산을 도식화하면 나비(butterfly) 모양의 구조가 반복됩니다.
실제 구현에서는 재귀 대신 **반복(iterative) + bit-reversal permutation** 으로 in-place 처리합니다.

## 알고리즘 문제에서의 활용

| 활용 분야 | 내용 |
|----------|------|
| **다항식 곱셈** | O(N²) → O(N log N). 두 다항식을 주파수 도메인에서 점별 곱 후 역변환 |
| **큰 수 곱셈** | 정수를 다항식으로 보고 FFT 적용 |
| **문자열 매칭** | 패턴 매칭을 합성곱으로 변환해 FFT로 가속 |
| **신호/이미지 처리** | 잡음 제거, 압축 등 |

### 다항식 곱셈 예시

```python
import cmath

def fft(a):
    n = len(a)
    if n == 1:
        return a
    even = fft(a[0::2])
    odd  = fft(a[1::2])
    T = [cmath.exp(-2j * cmath.pi * k / n) * odd[k] for k in range(n // 2)]
    return [even[k] + T[k] for k in range(n // 2)] + \
           [even[k] - T[k] for k in range(n // 2)]

def poly_multiply(A, B):
    n = 1
    while n < len(A) + len(B):
        n <<= 1
    fa = fft(A + [0] * (n - len(A)))
    fb = fft(B + [0] * (n - len(B)))
    fc = [a * b for a, b in zip(fa, fb)]
    # 역FFT 후 반올림
    result = ifft(fc)
    return [round(x.real) for x in result]
```

## 역 FFT (IFFT)

주파수 도메인 → 시간 도메인으로 복원합니다.
FFT와 구조는 동일하며, 회전 인수의 부호를 반전하고 N으로 나눕니다.

## 면접 포인트

- FFT는 DFT의 **분할 정복 최적화**이며, O(N²) → O(N log N) 개선입니다.
- N이 **2의 거듭제곱**일 때 Cooley-Tukey FFT가 효율적으로 동작합니다.
- **다항식 곱셈**이 대표적인 코딩 테스트 활용 사례입니다.
- IFFT는 FFT와 거의 동일한 구조로 복원이 가능합니다.
