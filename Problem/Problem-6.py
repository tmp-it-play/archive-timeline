import random

n1, n2 = random.randint(1, 100), random.randint(1, 100)
sumOfNumbers = n1 + n2
while(True):
    try:
        userInput = int(input("두 수의 합을 입력하세요: "))
        if userInput == sumOfNumbers:
            print("정답입니다.")
            break
        else:
            if (sumOfNumbers > userInput):
                print("정답보다 작습니다.")
            else:
                print("정답보다 큽니다.")
    except ValueError as ve:
        # ValueError과 ve의 효과가 다른데 as에 무슨 객체생성과 같은 효과가 있는 건가요?
        print(f"숫자가 아닙니다.:{ve}")
print(f"{n1},{n2}")