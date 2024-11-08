class Student():
    def __init__(self, name, studentId, score):
        self.__name = name
        self.__studentId = studentId
        self.__score = score

    def set_grade(self, score):
        self.__score = score

    def get_info(self):
        return f"이름: {self.__name}, 학번: {self.__studentId}, 점수: {self.__score}"


obj = Student("황지훈", 1418, 100)
print(obj.get_info())
obj.set_grade(90)
print(obj.get_info())