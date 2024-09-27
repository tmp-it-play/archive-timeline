import random


def coin_tossing():
    random.randint(0, 1)
    result = []
    for i in range(0, 10):
        if random.randint(0, 1) == 0:
            result.append(0)
        else:
            result.append(1)
    return result


result = coin_tossing()
print(coin_tossing())


def consecutive_numbers(list):
    count = 0
    max_count = 0
    for i in range(0, len(list)):
        if list[i] == 1:
            count += 1
        else:
            count = 0
        if count > max_count:
            max_count = count
    return max_count


print("최대 연속 길이=", consecutive_numbers(result))
