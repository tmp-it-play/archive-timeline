def deci2bin(n):
    if n > 1:
        deci2bin(n // 2)
    print(n % 2, end='')
    return


n = int(input("10진수: "))
deci2bin(n)