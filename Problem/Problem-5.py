try:
    price = int(input("물건값을 입력하시오: "))
    if price < 0:
        raise ValueError("물건값은 음수일 수 없습니다.")
    print("==입력금액==")
    money1000 = int(input("1000원 지폐개수: ")) * 1000
    if money1000 < 0:
        raise ValueError("1000원 지폐 개수는 음수일 수 없습니다.")
    money500 = int(input("500원 동전개수: ")) * 500
    if money500 < 0:
        raise ValueError("500원 동전 개수는 음수일 수 없습니다.")
    money100 = int(input("100원 동전개수: ")) * 100
    if money100 < 0:
        raise ValueError("100원 동전 개수는 음수일 수 없습니다.")
    money = money1000 + money500 + money100
    change = money - price
    if change < 0:
        print("지불한 금액이 부족합니다.")
    else:
        print("==거스름돈 출력==")
        count500 = change // 500
        count100 = (change % 500) // 100
        count10 = (change % 100) // 10
        count1 = change % 10
        print(f"500원= {count500}, 100원= {count100}, 10원= {count10}, 1원= {count1}")
except ValueError as ve:
    print(f"잘못된 입력: {ve}")