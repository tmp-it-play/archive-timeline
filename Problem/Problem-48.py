address = {}


def print_menu():
    print("1.연락처 추가\n2.연락처 삭제\n3.연락처 검색\n4.연락처 출력\n5.종료")
    menu = input("메뉴 항목을 선택하시오: ")
    return int(menu)


def add_contact():
    name = input("이름: ")
    phone = input("전화번호: ")
    address[name] = phone


def delete_contact():
    name = input("이름: ")
    del address[name]


def search_contact():
    name = input("이름: ")
    print("전화번호:", address[name])


def print_contact():
    for key in address:
        print(f"{key}의 전화번호: {address[key]}")


while True:
    menu = print_menu()
    if menu == 1:
        add_contact()
    elif menu == 2:
        delete_contact()
    elif menu == 3:
        search_contact()
    elif menu == 4:
        print_contact()
    else:
        break
