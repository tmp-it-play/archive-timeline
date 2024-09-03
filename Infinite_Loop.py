count = 0
for x in range(1, 101):
    count = 0
    for y in range(2, x - 1):
        if x % y == 0:
            count += 1
            break
    if count == 0:
        print(x)