class StudentGrade:
    def __init__(self, name, student_id, grade):
        self.__name = name
        self.__student_id = student_id
        self.__grade = grade

    def get_name(self):
        return self.__name

    def get_student_id(self):
        return self.__student_id

    def get_grade(self):
        return self.__grade

    def set_name(self, name):
        self.__name = name

    def set_student_id(self, student_id):
        self.__student_id = student_id

    def set_grade(self, grade):
        if (grade < 0 or grade > 100):
            print("잘못된 성적입니다")
            return
        self.__grade = grade

    def display_info(self):
        print("이름: ", self.__name)
        print("학번: ", self.__student_id)
        print("성적: ", self.__grade)


student = StudentGrade("김철수", "20240001", 85)
student.display_info()
student.set_grade(95)
print("성적 수정 후:")
student.display_info()
student.set_grade(110)
student.set_name("이영희")
print("이름 변경 후:")
student.display_info()
print("현재 성적:", student.get_grade())
print("현재 이름:", student.get_name())
print("현재 학번:", student.get_student_id())