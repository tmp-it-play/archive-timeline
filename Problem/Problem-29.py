def comparison(a, b):
    plus = a + b
    minus = a - b
    multiply = a * b
    divide = a / b
    return plus, minus, multiply, divide


n1 = int(input("첫 번째 정수를 입력하시오: "))
n2 = int(input("두 번째 정수를 입력하시오: "))
plus, minus, multiply, divide = comparison(n1, n2)
print(f"{plus}, {minus}, {multiply}, {divide}이 반환되었습니다.")