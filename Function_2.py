import math as m


def get_area(radius):
    area = m.pi * radius ** 2
    return area


result1 = get_area(3)
print("반지름이 3인 원의 면적=", result1)
result2 = get_area(20)
print("반지름이 20인 원의 면적=", result2)