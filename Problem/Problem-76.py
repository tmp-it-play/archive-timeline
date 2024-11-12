class Person:
    def __init__(self, name, ssn):
        self.name = name
        self.ssn = ssn

    def display_info(self):
        print("이름:", self.name)
        print("주민등록번호:", self.ssn)


class Student(Person):
    def __init__(self, name, ssn, subject):
        super().__init__(name, ssn)
        self.subjects = subject
        self.grade = 0

    def display_info(self):
        super().display_info()
        print("과목:", self.subjects)
        print("성적:", self.grade)


class Teacher(Person):
    def __init__(self, name, ssn, subject, salary):
        super().__init__(name, ssn)
        self.subjects = subject
        self.salary = salary

    def display_info(self):
        super().display_info()
        print("과목:", self.subjects)
        print("월급:", self.salary)


student = Student("홍길동", "12345678", ["자료구조"])
teacher = Teacher("김철수", "123456790", ["Python"], 3000000)
student.display_info()
teacher.display_info()