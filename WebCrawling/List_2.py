score = [85, 92, 78, 63, 88, 95]
for i in range(6):
    if score[i] >= 90:
        print("A")
    elif score[i] >= 80:
        print("B")
    elif score[i] >= 70:
        print("C")
    else:
        print("D")