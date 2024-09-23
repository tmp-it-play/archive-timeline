friends = ["Alice", "Bob", "Charlie", "David", "Eve"]
특정값 = input("찾고자 하는 이름을 입력하세요: ")
if 특정값 in friends:
    n = friends.index(특정값)
    print(n, friends[n])
else:
    print("이름을 찾을 수 없습니다")