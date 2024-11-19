list = []
a, b, c, d = map(float, input().split())
list.append(a)
list.append(b)
list.append(c)
list.append(d)
total = 0
print("숫자들의 평균:", sum(list) / len(list))
count = 0
for i in list:
    if i > sum(list) / len(list):
        count += 1
print("평균보다 큰 숫자의 개수:", count)