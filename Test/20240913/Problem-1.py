HIGH = 30
day = 0
position = 0
while position < HIGH:
    day += 1
    position += 7
    if position >= HIGH:
        break
    position -= 5
    print(f"Day : {day}: 달팽이의 위치 : {position} 미터")
print(f"Day : {day}: 달팽이의 위치 : {position} 미터")
print(f"우물을 탈출하는 데 걸린 날은 {day}일 입니다.")