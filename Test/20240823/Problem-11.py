money = int(input("money = "))
price = int(input("price = "))
change = money - price
print("change = ", change)
print("500원 = ", change // 500)
change = change % 500
print("100원 = ", change // 100)