def snake_line(n):
    for i in range(1, n + 1):
        if i % 2 == 0:
            for j in range(i * n, (i - 1) * n, -1):
                print("{:5d}".format(j), end=' ')
        else:
            for j in range((i - 1) * n + 1, i * n + 1):
                print("{:5d}".format(j), end=' ')
        print()
    return


n = int(input("n을 입력하시오: "))
snake_line(n)