try:
    num = int(input("정수를 입력해주세요: "))
    result = ("짝수" if num % 2 == 0 else "홀수")
    print(result)
except ValueError:
    print("정수를 입력해주세요")