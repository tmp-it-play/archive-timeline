list = []
a, b, c, d, e, f = map(int, input().split())
list.append(a)
list.append(b)
list.append(c)
list.append(d)
list.append(e)
list.append(f)
total = 0
for i in list:
    if i % 2 == 0:
        total += i
print(f"짝수들의 합 = {total}")
total = 0
for i in list:
    if i % 2 != 0:
        total += i
print(f"홀수들의 합 = {total}")