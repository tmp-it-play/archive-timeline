import random

n1, n2, op = random.randint(1, 10), random.randint(1, 10), random.choice(['+', '-', '*', '/'])
print(f"{n1}{op}{n2}의 값은? ", end="")
if op == '+' and int(input()) == n1 + n2:
    print("정답입니다.")
elif op == '-' and int(input()) == n1 - n2:
    print("정답입니다.")
elif op == '*' and int(input()) == n1 * n2:
    print("정답입니다.")
elif op == '/' and int(input()) == n1 / n2:
    print("정답입니다.")
else:
    print("틀렸습니다.")