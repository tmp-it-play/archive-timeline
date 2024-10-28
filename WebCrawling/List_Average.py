a = []
b, c, d = input("Enter 3 numbers: ").split()
a.append(int(b))
a.append(int(c))
a.append(int(d))
avr = sum(a) / len(a)
print("평균: ", avr)