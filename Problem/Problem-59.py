class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def printInfo(self):
        print(self.name, self.age)


A = Animal("강아지", 3)
A.printInfo()