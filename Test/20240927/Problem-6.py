lists = [20, 1, 12, 9, 18]
for i in range(len(lists)):
    print(lists[i], end="   ")
    if (lists[i] < 10):
        print(" ", end="")
    for j in range(lists[i]):
        print("*", end="")
    print()