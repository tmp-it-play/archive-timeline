def a_and_c(r):
    print(f"넓이 :{3.141592 * pow(r, 2):.2f}, 둘레 :{2 * 3.141592 * r:.2f}")


def main():
    while True:
        radius = int(input("반지름을 입력하세요 : "))
        if radius < 0:
            print("프로그램을 종료합니다.")
            break
        a_and_c(radius)


main()