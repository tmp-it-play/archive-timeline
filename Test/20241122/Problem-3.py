list1 = list(map(int, input("첫 번째 리스트: ").split(",")))
list2 = list(map(int, input("두 번째 리스트: ").split(",")))
result_list = [[0 for _ in range(len(list2))] for _ in range(len(list1))]
for i in range(len(list1)):
    for j in range(len(list2)):
        result_list[i][j] = list1[i] * list2[j]
for i in result_list:
    print(i)