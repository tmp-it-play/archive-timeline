class Employee:
    def __init__(self, name, position, salary, hours_worked):
        self.__name = name
        self.__position = position
        self.__salary = salary
        self.__hours_worked = hours_worked

    def log_hours(self, hours):
        self.__hours_worked += hours

    def calculate_pay(self):
        pay = self.__salary * self.__hours_worked
        if (self.__hours_worked > 40):
            return pay + self.__salary * (self.__hours_worked - 40) * 1.5
        return pay

    def promote(self, new_position, raise_amount):
        self.__position = new_position
        self.__salary += raise_amount
        print(f"{new_position}로 승진하여 급여가 {raise_amount}만큼 인상되었습니다.")

    def display_info(self):
        print(f"이름: {self.__name}, 직급: {self.__position}, 급여: {self.__salary}, 근무시간: {self.__hours_worked}")


obj = Employee("황지훈", "사원", 10000, 40)
obj.log_hours(10)
obj.display_info()
print(obj.calculate_pay())
obj.promote("대리", 2000)
obj.display_info()