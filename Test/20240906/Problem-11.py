n = int(input("정수를 입력하시오:"))
print("약수: [", end="")
for i in range(1, n + 1):
    if n % i == 0:
        print(i, " ", end="")
print("]")