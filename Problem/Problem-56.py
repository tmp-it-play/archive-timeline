values = [1, 2, 3, 4, 5, 6]
print(values[1], "{values[1]}")
print(values[-1], "{values[-1]}")
print(values[1:3], "{values[1:3]}")
print(len(values), "{len(values)}")
print(values.index(5), "{values.index(5)}")
print(max(values), "{max(values)}")
print(sum(values), "{sum(values)}")
print("------------------------")
values = [0] * 10
print(values)
values = [x for x in range(1, 11)]
print(values)
values = [x for x in range(1, 11) if x % 2 == 0]
print(values)
values = [x * x for x in range(1, 11)]
print(values)
print("------------------------")
aList = [10, 20, 30, 40, 50, 60]
del aList[0:3]
print(aList)
print("------------------------")
aList = [10, 20, 30, 40, 50, 60]
print(aList[-2])
print(aList[-3:-1])
print("------------------------")
aList.remove(60)
print(aList[::-2])
print("------------------------")
aList = [x + y for x in ['Hello', 'Good'] for y in ['World', 'Bye']]
print(aList)
print("------------------------")
aList = ['xyz', 'zz', 'PQRSTUVWZ']
print(max(aList))
print(min(aList))
print("------------------------")
aList = [1, 2, 3, 4]
aList[1:4] = [5, 6, 7]
print(aList)
nList = aList.copy()
print(nList)
aList.pop()
print(aList)
aList = [1, 2, 3, 4, 5, 6]
aList.insert(1,20)
print(aList)
