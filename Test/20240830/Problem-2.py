x, y = int(input("X=")), int(input("Y="))
max, min = x if x > y else y, x if x < y else y
print("Max=", max)
print("Min=", min)
op = input("Enter the operation: ")
if op == "1":
    print("one")
elif op == "2":
    print("two")
elif op == "3":
    print("three")
speed = int(input("Enter the speed: "))
if speed > 60 and speed < 100:
    print("정상속도")