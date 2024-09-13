def armstrong_num():
    list = []
    for i in range(100, 1000):
        sum = 0
        temp = i
        while temp > 0:
            digit = temp % 10
            sum += digit ** 3
            temp //= 10
        if i == sum:
            list.append(i)
    return list


print(f"세 자리 암스트롱 수: {armstrong_num()}")