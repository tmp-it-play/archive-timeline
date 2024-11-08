class BankAccount:
    def __init__(self, account_number, owner, balance, transactions):
        self.__account_number = account_number
        self.__owner = owner
        self.__balance = balance
        self.__transactions = transactions

    def deposit(self, amount):
        self.__balance += amount
        self.__transactions.append(f"{amount}원 입금")

    def withdraw(self, amount):
        if self.__balance < amount:
            print("잔액이 부족합니다")
        else:
            self.__balance -= amount
            self.__transactions.append(f"{amount}원 출금")

    def check_balance(self):
        return self.__balance

    def transaction_history(self):
        return self.__transactions

    def apply_interest(self, rate):
        self.__balance += self.__balance * rate
        self.__transactions.append(f"{rate * 100}% 이자 발생")


obj = BankAccount("110-123-123456", "황지훈", 10000, [])
print(obj.check_balance())
obj.deposit(1000)
obj.withdraw(500)
obj.apply_interest(0.05)
print(obj.check_balance())
print(obj.transaction_history())