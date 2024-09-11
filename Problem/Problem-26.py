def compair(a, b):
    if a > b:
        return a
    else:
        return b


n1, n2 = map(int, input().split())
print(compair(n1, n2))