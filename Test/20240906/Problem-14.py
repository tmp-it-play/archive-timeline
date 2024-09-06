i = 0
result = 0
while i <= 500:
    i += 1
    if pow(i, 2) > 500:
        result = i
        break
print(f"n^2 > 500인 가장 작은 n은 {result}입니다")