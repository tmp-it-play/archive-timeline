try:
    totalPrice = int(input("상품가격을 입력하세요: "))
    if totalPrice < 0:
        raise ValueError("상품가격이 음수입니다.")
    deliveryCharge = 0
    if totalPrice > 20000:
        deliveryCharge = 0
    else:
        deliveryCharge = 3000
    print("배송비는 %d원 입니다." % deliveryCharge)
except ValueError as ve:
    print(f"상품가격이 잘못 입력되었습니다.:{ve}")
finally:
    print("\033[92m" + "프로그램을 종료합니다." + "\033[0m")