import random as r


def number_game():
    number = r.randint(1, 100)
    while True:
        guess = int(input("숫자를 입력하세요: "))
        if guess == number:
            print("정답!")
            break
        elif guess > number:
            print("다운!")
        else:
            print("업!")

number_game()