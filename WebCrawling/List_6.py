numbers = [4, 2, 2, 8, 3, 3, 3, 7, 8, 8, 8, 8]
numbers.sort()


def frequent_number():
    result = 0
    count = 0
    for i in numbers:
        if numbers.count(i) > count:
            result = i
            count = numbers.count(i)
    return result


print(frequent_number())