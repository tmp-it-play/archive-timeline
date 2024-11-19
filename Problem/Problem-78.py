list = []
a, b, c, d, e, f, g = map(int, input().split())
list.append(a)
list.append(b)
list.append(c)
list.append(d)
list.append(e)
list.append(f)
list.append(g)
total = 0
print(f"숫자들의 합: {sum(list)}")
print(f"최대값: {max(list)}")
print(f"최솟값: {min(list)}")