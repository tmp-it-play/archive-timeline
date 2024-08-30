id = "info"
password = "education"
user_id = input("아이디를 입력하세요: ")
user_password = input("비밀번호를 입력하세요: ")
if user_id == id and user_password == password:
    print("로그인 되었습니다.")
else:
    print("로그인에 실패했습니다.")