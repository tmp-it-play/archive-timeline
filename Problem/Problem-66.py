class Car:
    def __init__(self, model, color, fuel_level, fuel_efficiency):
        self.model = model
        self.color = color
        self.fuel_level = fuel_level
        self.fuel_efficiency = fuel_efficiency

    def drive(self, distance):
        if self.fuel_level < distance / self.fuel_efficiency:
            print("연료가 부족합니다. 주유가 필요합니다.")
        else:
            self.fuel_level -= distance / self.fuel_efficiency
            print(distance, "km 이동하였습니다")

    def refuel(self, amount):
        self.fuel_level += amount

    def check_fuel(self):
        print("현재 연료량:", self.fuel_level)


obj = Car("소나타", "검정", 100, 0.1)
obj.drive(500)
obj.check_fuel()
obj.refuel(50)
obj.check_fuel()