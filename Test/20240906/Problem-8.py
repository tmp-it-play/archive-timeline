num = int(input("정수입력: "))
sum = 0
for i in range(num + 1):
    sum += i
print("합 결과:", sum)
sum = 0
for i in range(1, num + 1, 2):
    sum += i
print("홀수 합 결과:", sum)
sum = 0
for i in range(2, num + 1, 2):
    sum += i
print("짝수 합 결과:", sum)