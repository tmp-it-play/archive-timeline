a=tuple(map(int,input().split()))

def max(a):
    b=0
    for i in a:
        if i > b:
            b=i
    return b

print(max(a))