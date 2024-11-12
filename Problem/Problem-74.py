class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print("동물이 소리를 냅니다")

    def display_info(self):
        print("이름:", self.name)


class Dog(Animal):
    def speak(self):
        print("멍멍")


class Cat(Animal):
    def speak(self):
        print("야옹")


animal = Animal("동물")
dog = Dog("바둑이")
cat = Cat("나비")
animal.display_info()
animal.speak()
dog.display_info()
dog.speak()
cat.display_info()
cat.speak()