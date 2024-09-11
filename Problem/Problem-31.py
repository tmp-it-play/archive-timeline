def getMoneyText(amount):
    if (amount >= 900 or (amount >= 90 and amount < 100) or (amount == 9)):
        if (amount >= 900):
            return "구백" + getMoneyText(amount - 900)
        elif (amount >= 90 and amount < 100):
            return "구십" + getMoneyText(amount - 90)
        else:
            return "구원"
    elif ((amount < 900 and amount >= 800) or (amount >= 80 and amount < 90) or (amount == 8)):
        if (amount < 900 and amount >= 800):
            return "팔백" + getMoneyText(amount - 800)
        elif (amount >= 80 and amount < 90):
            return "팔십" + getMoneyText(amount - 80)
        else:
            return "팔원"
    elif ((amount < 800 and amount >= 700) or (amount >= 70 and amount < 80) or (amount == 7)):
        if (amount < 800 and amount >= 700):
            return "칠백" + getMoneyText(amount - 700)
        elif (amount >= 70 and amount < 80):
            return "칠십" + getMoneyText(amount - 70)
        else:
            return "칠원"
    elif ((amount < 700 and amount >= 600) or (amount >= 60 and amount < 70) or (amount == 6)):
        if (amount < 700 and amount >= 600):
            return "육백" + getMoneyText(amount - 600)
        elif (amount >= 60 and amount < 70):
            return "육십" + getMoneyText(amount - 60)
        else:
            return "육원"
    elif ((amount < 600 and amount >= 500) or (amount >= 50 and amount < 60) or (amount == 5)):
        if (amount < 600 and amount >= 500):
            return "오백" + getMoneyText(amount - 500)
        elif (amount >= 50 and amount < 60):
            return ("오십" + getMoneyText(amount - 50))
        else:
            return "오원"
    elif ((amount < 500 and amount >= 400) or (amount >= 40 and amount < 50) or (amount == 4)):
        if (amount < 500 and amount >= 400):
            return "사백" + getMoneyText(amount - 400)
        elif (amount >= 40 and amount < 50):
            return "사십" + getMoneyText(amount - 40)
        else:
            return "사원"
    elif ((amount < 400 and amount >= 300) or (amount >= 30 and amount < 40) or (amount == 3)):
        if (amount < 400 and amount >= 300):
            return "삼백" + getMoneyText(amount - 300)
        elif (amount >= 30 and amount < 40):
            return "삼십" + getMoneyText(amount - 30)
        else:
            return "삼원"
    elif ((amount < 300 and amount >= 200) or (amount >= 20 and amount < 30) or (amount == 2)):
        if (amount < 300 and amount >= 200):
            return "이백" + getMoneyText(amount - 200)
        elif (amount >= 20 and amount < 30):
            return "이십" + getMoneyText(amount - 20)
        else:
            return "이원"
    elif ((amount < 200 and amount >= 100) or (amount >= 10 and amount < 20) or (amount == 1)):
        if (amount < 200 and amount >= 100):
            return "백" + getMoneyText(amount - 100)
        elif (amount >= 10 and amount < 20):
            return "십" + getMoneyText(amount - 10)
        else:
            return "일원"
    else:
        return "영원"


money = int(input("1000이하의 금액을 입력하시오: "))
print(getMoneyText(money))