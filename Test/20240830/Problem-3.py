weight = int(input("몸무게: "))
height = int(input("키: "))
bmi = weight / pow((height / 100), 2)
if bmi < 18.5:
    print("마른 체형입니다.")
elif 18.5 <= bmi < 25.0:
    print("표준입니다.")
elif 25.0 <= bmi < 30.0:
    print("비만입니다.")
else:
    print("고도 비만입니다.")