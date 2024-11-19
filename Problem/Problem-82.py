items = (("청바지", 50000), ("셔츠", 35000), ("신발", 80000), ("가방", 100000), ("모자", 25000))
dict = {}
for item in items:
    if item[1] >= 70000:
        discount = item[1] - (item[1] * 0.2)
    elif item[1] >= 50000 and item[1] < 70000:
        discount = item[1] - (item[1] * 0.15)
    else:
        discount = item[1]
    dict[item[0]] = [item[1], discount]
count = 0
for item in dict:
    print(f"{item}: {dict[item][0].__format__(',.0f')}, {dict[item][1].__format__(',.0f')}")
    if dict[item][0] != dict[item][1]:
        count += 1
print(f"할인된 물품의 개수: {count}")