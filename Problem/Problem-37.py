print("------------------\n1. 친구 리스트 출력\n2. 친구 추가\n3. 친구 삭제\n4. 이름 변경\n9. 종료")
try:
    select = int(input("메뉴를 선택하시오: "))
    friends = []
    while select != 9:
        if select == 1:
            print(friends)
        elif select == 2:
            name = input("이름을 입력하시오: ")
            friends.append(name)
        elif select == 3:
            name = input("이름을 입력하시오: ")
            friends.remove(name)
        elif select == 4:
            name = input("이름을 입력하시오: ")
            index = friends.index(name)
            name = input("새로운 이름을 입력하시오: ")
            friends[index] = name
        select = int(input("메뉴를 선택하시오: "))
        print("------------------")
except ValueError as e:
    print("숫자를 입력하시오.", e)