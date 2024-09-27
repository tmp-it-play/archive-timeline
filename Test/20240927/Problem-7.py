list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print("실행전: ", list)
result = [n - (n * 2) if 2 < n < 9 else n for n in list]
print("실행후: ", result)