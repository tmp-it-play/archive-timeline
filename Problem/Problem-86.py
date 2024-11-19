a, b, c = map(int, input("첫 번째 리스트를 입력하세요: ").split(", "))
list1 = [a, b, c]
a, b, c = map(int, input("두 번째 리스트를 입력하세요: ").split(", "))
list2 = [a, b, c]
a, b, c = map(int, input("세 번째 리스트를 입력하세요: ").split(", "))
list3 = [a, b, c]
set1 = set(list1)
set2 = set(list2)
set3 = set(list3)
print("합집합:", set1 | set2 | set3)