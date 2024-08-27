try:
    country = input("배송지(현재는 korea와 us만 가능): ")
    price = int(input("상품의 가격: "))
    if country == "korea":
        if price >= 20000:
            shipping_cost = 0
        else:
            shipping_cost = 3000
    else:
        if price >= 100000:
            shipping_cost = 0
        else:
            shipping_cost = 8000
    print("배송비 = ", shipping_cost)
except ValueError as ve:
    print(f"정수를 입력해주세요: {ve}")