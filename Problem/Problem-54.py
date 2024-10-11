email = input("이메일 주소를 입력하시오:")
print(email)
print(f"아이디: {email.split('@')[0]}")
print(f"도메인: {email.split('@')[1]}")