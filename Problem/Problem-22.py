def star_piramid(n):
    for i in range(n):
        print(" " * (n - i - 1) + "*" * (2 * i + 1))


def star_2for_print(n):
    for i in range(n):
        for j in range(n - i - 1):
            print(" ", end="")
        for j in range(2 * i + 1):
            print("*", end="")
        print("")


n = int(input())
star_piramid(n)
star_2for_print(n)
