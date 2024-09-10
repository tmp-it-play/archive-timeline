def get_sum(n1, n2):
    sum = 0
    for i in range(n1, n2 + 1):
        sum += i
    return sum


n1, n2 = map(int, input().split())
print(get_sum(n1, n2))