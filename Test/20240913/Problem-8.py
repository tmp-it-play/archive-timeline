def sort(list):
    list.sort()
    print(f"정렬된 리스트는 다음과 같습니다: ", end="")
    length = len(list)
    for i in range(length):
        temp = list[i]
        print(temp, end=" ")


list = list(map(int, input("정렬할 리스트를 입력하세요: ").split()))
sort(list)