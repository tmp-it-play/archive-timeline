score = [10.0, 9.0, 8.3, 7.1, 3.0, 9.0]
print(f"제거전 {score}")
max, min = 0, 0
for i in score:
    if i > max:
        min = max
        max = i
    elif i > min:
        min = i
score.remove(min)
score.remove(max)
print(f"제거후 {score}")