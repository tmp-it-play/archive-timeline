n = int(input("양의 정수 n을 입력하세요: "))
fac = 0
for i in range(1, n + 1):
    fac += pow(i, 2)
print(f"{n} 팩토리얼의 합은 {fac}입니다.")