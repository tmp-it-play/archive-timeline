temperatures = (("서울", 25.5), ("부산", 30.1), ("대구", 28.3), ("광주", 22.0), ("대전", 27.5))
dict = {}
for i in temperatures:
    if i[1] >= 30:
        message = "Very Hot"
    elif i[1] >= 25 and i[1] < 30:
        message = "Hot"
    else:
        message = "Normal"
    dict[i[0]] = [i[1], message]
for i in dict:
    print(f"{i}: {dict[i][0]}, {dict[i][1]}")
count = 0
for i in dict:
    if dict[i][0] < 30 and dict[i][0] >= 25:
        count += 1
print(f"Hot 상태의 도시 수: {count}")