def fibo(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibo(n - 1) + fibo(n - 2)


def lbo():
    count = 0
    for i in range(1, 17):
        print(f"fibo({count}) = {fibo(i)}")
        count += 1


lbo()