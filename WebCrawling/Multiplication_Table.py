def multiplication_table(n):
    for i in range(1, 10):
        print(f"{n} x {i} = {n * i}")


for i in range(2, 10):
    multiplication_table(i)