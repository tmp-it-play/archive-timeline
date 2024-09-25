rows = 3
cols = 5
s = []
for row in range(rows):
    s += [[0] * cols]
print("s=", s)
print("\n")
s = [([0] * cols) for row in range(rows)]
print("s=", s)
print("\n")
s = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15]]
rows = len(s)
cols = len(s[0])
for r in range(rows):
    for c in range(cols):
        print(f"{s[r][c]}", end=" ")
    print()
print("\n")
x = 1
total = 0
for y in range(cols):
    total = total + s[x][y]
print(total)
print("\n")
x = 2
total = 0
for y in range(rows):
    total = total + s[x][y]
print(total)


def sum(numbers):
    total = 0
    for x in range(len(numbers)):
        for y in range(len(numbers[x])):
            total = total + numbers[x][y]
    return total


print("\n")
print(sum(s))

print("\n")
table = []


def printList(mylist):
    for row in range(len(mylist)):
        for col in range(len(mylist[0])):
            print(mylist[row][col], end=" ")
        print()


def init(mylist):
    for row in range(len(mylist)):
        for col in range(len(mylist[0])):
            if (row + col) % 2 == 0:
                mylist[row][col] = 1


for row in range(10):
    table += [[0] * 10]
init(table)
printList(table)