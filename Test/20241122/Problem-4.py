list1 = set(map(int, input("첫 번째 리스트를 입력하세요: ").split(",")))
list2 = set(map(int, input("두 번째 리스트를 입력하세요: ").split(",")))


def intersection(set1, set2):
    return set1 & set2


def union(set1, set2):
    return set1 | set2


def difference(set1, set2):
    return set1 - set2


print(f"교집합: {intersection(list1, list2)}")
print(f"합집합: {union(list1, list2)}")
print(f"차집합: {difference(list1, list2)}")