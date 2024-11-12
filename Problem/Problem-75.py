class Car:
    def __init__(self, model, max_speed):
        self.model = model
        self.max_speed = max_speed

    def display_info(self):
        print("모델:", self.model)
        print("최고 속도:", self.max_speed)

    def start(self):
        print("자동차가 출발합니다")


class SuperCar(Car):
    def turbo_boost(self):
        print("터보 부스트! 최고 속도가 50km/h 증가합니다.")
        self.max_speed += 50


class SportsCar(Car):
    def drift(self):
        print("스포츠카가 드리프트를 시작합니다!.")


car = Car("일반 자동차", 180)
super_car = SuperCar("페라리", 300)
sports_car = SportsCar("포르쉐", 250)

car.display_info()
car.start()
super_car.display_info()
super_car.start()
super_car.turbo_boost()
super_car.display_info()
sports_car.display_info()
sports_car.start()
sports_car.drift()