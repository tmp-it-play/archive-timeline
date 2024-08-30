print("세 정수를 입력하시오: ", end="")
n1, n2, n3 = map(int, input().split())
for i in range(3):
    if n1 > n2:
        n1, n2 = n2, n1
    if n2 > n3:
        n2, n3 = n3, n2
print("정렬된 숫자는", n1, n2, n3, "입니다.")