import random

random_num = random.randint(1, 100)

game_count = 1

while True:
    try:
        user_num = int(input("1~100 사이의 숫자를 입력하세요: "))
        if user_num == random_num:
            print(f"정답입니다!{game_count}번만에 맞추셨습니다.")
            break
        elif user_num > random_num:
            print("Down")
        elif user_num < random_num:
            print("Up")
        game_count += 1
    except ValueError:
        print("숫자만 입력해주세요")
