class DiscountInfo:
    def __init__(self, discounted_price, gift):
        self.discounted_price = discounted_price
        self.gift = gift

    def __str__(self):
        return f"할인 금액: {self.discounted_price}원\n{self.gift}"


try:
    price = int(input("본래 가격: "))
    if price < 0:
        raise ValueError
    discounted_price = (price - (price * 0.1) if price < 1000000 else price - (price * 0.15))
    gift = ("사은품 지급" if price > 1000000 else "사은품 미지급")
    result = DiscountInfo(int(discounted_price), gift)
    print(result)
except ValueError:
    print("가격은 정수(양수)를 입력해주세요")