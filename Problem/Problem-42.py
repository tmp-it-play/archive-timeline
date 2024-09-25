list1 = [10, 20, 30, 40, 50]
x = int(input())
list1 = [sum(list1[:i + 1]) for i in range(len(list1))]
print(list1)