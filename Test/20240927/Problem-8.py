string = ['aba', 'xyz', 'abc', '121']
count = 0
for i in range(0, len(string)):
    if string[i] == string[i][::-1]:
        count += 1
print(string)
print("문자열의 개수 =", count)