n1 = int(input("정수1 입력: "))
n2 = int(input("정수2 입력: "))


def uclerid(n1, n2):
    if n1 > n2:
        n1, n2 = n2, n1
    for i in range(n1, 0, -1):
        if n1 % i == 0 and n2 % i == 0:
            return i


if uclerid(n1, n2) == 1:
    print(f"{n1}과 {n2}는 서로수입니다.")
else:
    print(f"{n1}과 {n2}의 최대공약수는 ", uclerid(n1, n2), "입니다")
