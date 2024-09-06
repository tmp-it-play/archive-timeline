sum = 0
i = 1
while i <= 100:
    if i % 3 == 0:
        sum += i
    i += 1
print("1부터 100 사이의 모든 3의 배수의 합:", sum)