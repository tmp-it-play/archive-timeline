def star(n):
    for i in range(n):
        print("*" * (i + 1))


def star_2for(n):
    for i in range(n):
        for j in range(i + 1):
            print("*", end="")
        print("")


n = int(input())
star(n)
star_2for(n)
