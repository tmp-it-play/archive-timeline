class Account:
    def __init__(self):
        self.__balance = 0

    def withdraw(self, amount):
        self.__balance -= amount
        print("통장에서 ", amount, "출금되었음")

    def deposit(self, amount):
        self.__balance += amount
        print("통장에 ", amount, "입금되었음")


obj = Account()
obj.withdraw(100)