n1, n2 = map(int, input("두 정수를 입력하시오: ").split())
print(f"{n1}는(은) {n2}의 배수입니다.") if n1 % n2 == 0 else print(f"{n1}는(은) {n2}의 배수가 아닙니다.")