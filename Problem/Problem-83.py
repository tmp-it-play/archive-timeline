list1 = []
list2 = []
a, b, c = map(int, input("첫 번째 리스트: ").split())
list1.append(a)
list1.append(b)
list1.append(c)
a, b, c = map(int, input("두 번째 리스트: ").split())
list2.append(a)
list2.append(b)
list2.append(c)
result_list = []
for i in range(3):
    result_list.append(list1[i] + list2[i])
print("두 리스트의 합:", result_list)