movies = (("Inception", 15), ("Frozen", 7), ("The Godfather", 18), ("Toy Story", 5), ("Avengers", 12))
dict = {}
for i in movies:
    if i[1] >= 18:
        message = "Adult"
    elif i[1] >= 13 and i[1] < 18:
        message = "Teen"
    else:
        message = "Kids"
    dict[i[0]] = [i[1], message]
for i in dict:
    print(f"{i}: {dict[i][0]}, {dict[i][1]}")
count = 0
for i in dict:
    if dict[i][0] < 18 and dict[i][0] >= 13:
        count += 1
print(f"Teen 등급 영화 수: {count}")