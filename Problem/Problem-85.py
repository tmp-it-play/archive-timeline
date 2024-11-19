a, b, c, d = map(int, input("첫 번째 리스트를 입력하세요: ").split())
list1 = [a, b, c, d]
a, b, c, d = map(int, input("두 번째 리스트를 입력하세요: ").split())
list2 = [a, b, c, d]
set1 = set(list1)
set2 = set(list2)
try:
    print("공통요소:", set1 & set2)
except:
    print("공통 요소 없음")