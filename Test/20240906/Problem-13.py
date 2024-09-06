globals()

n = int(input("생성할 피보나치수열의 항 수를 입력하세요: "))


def fib(n):
    a, b = 0, 1
    for i in range(n + 1):
        print(a, ",", end=" ")
        a, b = b, a + b
    return a
    '''
    check1=0
    check2=0
    if n==0:
        if check1==0:
            print(0,",", end=" ")
            check1+=1
        return 0
    elif n==1:
        if check2==0:
            print(1,",", end=" ")
            check2+=1
        return 1
    else:
        print(fib(n-1)+fib(n-2),",", end=" ")
        return fib(n-1)+fib(n-2)
    '''


fib(n)