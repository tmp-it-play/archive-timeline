temps = [28, 31, 33, 35, 27, 26, 25]
values = temps
print(temps)
values[3] = 39
print(temps)
print(values)
print("\n")
temps = [28, 31, 33, 35, 27, 26, 25]
values = list(temps)
print(temps)
values[3] = 39
print(values)
print(temps)
print("\n")
numbers = list(range(10))
print(numbers)
print("\n")
import time

SIZE = 50000
start_time = time.time()
mylist = []
for x in range(SIZE):
    mylist = mylist + [x * x]
print("수행시간 =", time.time() - start_time)
start_time = time.time()
mylist = []
for x in range(SIZE):
    mylist.append(x * x)
print("수행시간 =", time.time() - start_time)