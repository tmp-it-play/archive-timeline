class Student:
    def __init__(self, name, grade, studentId):
        self.name = name
        self.grade = grade
        self.studentId = studentId

    def printDetail(self):
        print(self.name, self.grade, self.studentId)


s1 = Student("홍길동", 3, 20190001)
s2 = Student("김철수", 2, 20190002)
s3 = Student("이영희", 1, 20190003)
s1.printDetail()
s2.printDetail()
s3.printDetail()