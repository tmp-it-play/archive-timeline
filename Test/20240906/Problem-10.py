def for_star(n):
    for i in range(n):
        for j in range(n - i):
            print("*", end="")
        print("")


n = int(input("숫자를 입력하세요: "))
for_star(n)