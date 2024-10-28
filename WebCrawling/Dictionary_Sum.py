a = {}
sum = 0
for i in range(2):
    b, c = input("").split(":")
    a[b] = int(c)
for i in a.values():
    sum = i + sum
print("총 점수", sum)