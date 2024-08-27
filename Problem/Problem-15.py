try1 = int(input("삼각형의 한 변의 길이를 입력하시오: "))
try2 = int(input("삼각형의 한 변의 길이를 입력하시오: "))
try3 = int(input("삼각형의 한 변의 길이를 입력하시오: "))
if try1 + try2 > try3 and try2 + try3 > try1 and try3 + try1 > try2:
    print("올바른 삼각형입니다.")
else:
    print("삼각형이 아닙니다.")