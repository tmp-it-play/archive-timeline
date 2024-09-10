alist = [1, 2, 3]
print(*alist)
print(alist)


def sum(a, b, c):
    return (a + b + c)


def main():
    print(sum(*alist))


main()
