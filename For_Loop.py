while True:
    mod = int(input("Select the mode: 1, 2, 3: "))
    if mod == 1:
        for i in [1, 2, 3, 4, 5]:
            print("i=,", i)
    elif mod == 2:
        for i in range(6):
            print("i=,", i)
    elif mod == 3:
        for i in range(1, 6, 2):
            print("i=,", i)
    elif mod == 4:
        for i in range(1, 5):
            print(i, end=" ")
    elif mod == 5:
        for i in range(10, 0, -1):
            print(i, end=" ")
    elif mod == 6:
        sum = 0
        n = 10
        for i in range(1, n + 1):
            sum += i
        print("합=", sum)
    elif mod == 7:
        for i in range(1, 6):
            print("9 *", i, "=", 9 * i)
    else:
        break