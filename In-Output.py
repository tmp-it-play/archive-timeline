'''
name = input("이름을 입력하시오: ")
print(name, "씨 안녕하세요?")
print("파이썬에 오신 것을 환영합니다.")
'''
try:
    x = input("첫 번째 정수를 입력하시오: ")
    y = input("두 번째 정수를 입력하시오: ")
    sum = x + y
    print("합은", sum)
    x = int(x)
    y = int(y)
    sum = x + y
    print("합은", sum)
    x = 100
    y = 200
    print(f"{x}와 {y}의 합={x + y}")
    print(x, "와", y, "의 합=", x + y)
    print("-" * 45)
    s=3.3
    area=float(input("면적(제곱미터):"))
    py=area/s
    print(py,"평")
    print("%.2f" %py,"평")
    print("%10.2f" %py,"평")
except ValueError as e:
    print(e)