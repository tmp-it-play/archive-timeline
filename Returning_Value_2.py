def get_info():
    name = input("이름: ")
    age = int(input("나이: "))
    return name, age


st_name, st_age = get_info()
print(f"이름은 {st_name}, 나이는 {st_age}세 입니다.")