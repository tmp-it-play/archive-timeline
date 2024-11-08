class Student:
    def __init__(self, name=None, age=0):
        self.__name = name
        self.__age = age

    def get_name(self):
        return self.__name
    def get_age(self):
        return self.__age
    def set_name(self, name):
        self.__name = name
    def set_age(self, age):
        self.__age = age


obj = Student("Hong", 20)
print(obj.get_name())