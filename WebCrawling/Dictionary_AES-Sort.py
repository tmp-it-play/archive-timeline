a = {}
for i in range(3):
    b, c = input().split(": ")
    a[b] = int(c)
a = {x: y for x, y in sorted(a.items(), key=lambda x: x[1])}
print(a)