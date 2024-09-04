def star_square(n):
    for i in range(n):
        for j in range(n):
            print("*", end="")
        print("")


def number_square(n):
    count = 0
    for i in range(n):
        for j in range(n):
            count += 1
            print(count, end="")
        print("")


n = int(input())
star_square(n)
number_square(n)