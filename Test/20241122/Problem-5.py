class Classroom:
    def __init__(self):
        self.students = []
        self.addendance = {}

    def add_student(self, name):
        self.students.append(name)
        self.addendance[name] = 0

    def mark_attendance(self, name):
        if name in self.students:
            self.addendance[name] += 1
        else:
            print(f"{name} 학생을 찾을 수 없습니다")

    def get_attendance(self, name):
        if name in self.students:
            print(f"{name} 학생의 출석 횟수: {self.addendance[name]}")
        else:
            print(f"{name} 학생을 찾을 수 없습니다")


obj = Classroom()
obj.add_student("최민준")
obj.add_student("권재헌")
obj.add_student("황지훈")
obj.add_student("이용표")
obj.mark_attendance("서경주")
obj.mark_attendance("권재헌")
obj.mark_attendance("황지훈")
obj.mark_attendance("권재헌")
obj.get_attendance("최민준")
obj.get_attendance("권재헌")
obj.get_attendance("김태은")