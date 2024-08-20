from decimal import Decimal, ROUND_DOWN

radius = input("반지름을 입력하시오: ")
volume = Decimal(4 / 3) * Decimal('3.141592') * Decimal(radius) ** 3
volume = volume.quantize(Decimal('1.00000000000'), rounding=ROUND_DOWN)
print("구의 부피=%.11f" % volume)