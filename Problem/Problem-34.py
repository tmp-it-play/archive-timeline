list = [3, 9, 4, 2, 15, 99]
second_max = 0
max = 0
for i in list:
    if i > max:
        second_max = max
        max = i
    elif i > second_max:
        second_max = i
print(second_max)