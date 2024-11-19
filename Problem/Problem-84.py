a, b, c = map(int, input().split())
list1 = [a, b, c]
result_list = [[i, i ** 2] for i in list1]
for i in result_list:
    print(i)