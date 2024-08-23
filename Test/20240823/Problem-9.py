pi = 3.141592
radius = int(input("반지름은? "))
print("원의 넓이는 %.6f" % (pi * pow(radius, 2)))
print("원의 둘레는 %.6f" % (2 * pi * radius))
print("구의 겉넓이는 %.6f" % (4 * pi * pow(radius, 2)))
print("구의 부피는 %.6f" % (4 / 3 * pi * pow(radius, 3)))