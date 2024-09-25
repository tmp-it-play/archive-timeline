prices = [135, -545, 922, 356, -992, 217]
mprices = [x if x > 0 else 0 for x in prices]
print(mprices)
print("\n")
words = ["All", "good", "things", "must", "come", "to", "an", "end"]
letters = [w[0] for w in words]
print(letters)
print("\n")
numbers = [x + y for x in ['a', 'b', 'c'] for y in ['x', 'y', 'z']]
print(numbers)