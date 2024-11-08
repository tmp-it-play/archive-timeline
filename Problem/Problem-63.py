class Classroom:
    def __init__(self, *students):
        self.__students = list(students)
        self.__attendance = {student: 0 for student in students}

    def add_student(self, student):
        self.__students.append(student)
        self.__attendance[student] = 0

    def mark_attendance(self, student):
        try:
            self.__attendance[student] += 1
        except KeyError:
            print("학생을 찾을 수 없습니다")

    def get_attendance(self, student):
        try:
            return self.__attendance[student]
        except KeyError:
            print("학생을 찾을 수 없습니다")


obj = Classroom("권재헌", "김명현", "김민솔")
print(obj.get_attendance("권재헌"))
obj.mark_attendance("권재헌")
print(obj.get_attendance("권재헌"))
obj.add_student("김홍준")