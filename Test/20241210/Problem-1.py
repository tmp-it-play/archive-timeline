import os

for i in range(1, 10):
    for j in range(1, 10):
        print(f"{j}*{i}={(j * i):<2}", end=" ")
    print()
os.system("pause")