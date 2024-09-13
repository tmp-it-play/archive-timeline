def average(a, b, c):
    return (a + b + c) / 3


def max(a, b, c):
    if a > b and a > c:
        return a
    elif b > a and b > c:
        return b
    else:
        return c


def min(a, b, c):
    if a < b and a < c:
        return a
    elif b < a and b < c:
        return b
    else:
        return c


a, b, c = input("세 수를 입력하시오 : ").split()
a = int(a)
b = int(b)
c = int(c)
print(f"{a}, {b}, {c}의 평균값은 {average(a, b, c):.2f}")
print(f"{a}, {b}, {c}의 최대값은 {max(a, b, c)}")
print(f"{a}, {b}, {c}의 최소값은 {min(a, b, c)}")