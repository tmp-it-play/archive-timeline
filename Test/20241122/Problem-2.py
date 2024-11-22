students = (("명현", 85), ("재헌", 92), ("승일", 78), ("태은", 95), ("민솔", 88))
result = dict()
count = 0
for student in students:
    if student[1] >= 90:
        result[student[0]] = "A"
    elif student[1] >= 80:
        result[student[0]] = "B"
        count += 1
    elif student[1] >= 70:
        result[student[0]] = "C"
    else:
        result[student[0]] = "D"
for key in result:
    print(f"{key}: {result[key]}")
print(f"\nB학점을 받은 학생 수: {count}")