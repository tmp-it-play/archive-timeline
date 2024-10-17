total = 0
result = []
for n in range(15):
    if n % 3 != 0 or n % 2 != 0:
        continue
    result.append(n)
print(result)