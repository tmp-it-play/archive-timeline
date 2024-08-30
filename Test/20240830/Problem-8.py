num = int(input("정수를 입력하시오: "))
flag1, flag2 = False, False
if num % 2 == 0:
    print(f"{num}은(는) 2(으)로 나누어집니다.")
    flag1 = True
else:
    print(f"{num}은(는) 2(으)로 나누어지지 않습니다.")
if num % 3 == 0:
    print(f"{num}은(는) 3(으)로 나누어집니다.")
    flag2 = True
else:
    print(f"{num}은(는) 3(으)로 나누어지지 않습니다.")
if flag1 and flag2:
    print(f"{num}은(는) 2와 3 모두 동시에 나누어집니다.")
else:
    print(f"{num}은(는) 2와 3 모두 동시에 나누어지지 않습니다.")