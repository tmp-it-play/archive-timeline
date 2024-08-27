import random

n1 = int(input("어디를 수비하시겠어요?(왼쪽: 1,중앙: 2, 오른쪽: 3)"))
n2 = random.randint(1, 3)
if n1 == n2:
    print("패널티킥 수비에 성공하셨습니다.")
else:
    print("패널티킥이 성공했습니다.")