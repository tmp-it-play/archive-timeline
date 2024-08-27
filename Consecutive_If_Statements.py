richter_scale = float(input("리히터 규모: "))
if richter_scale < 2.0:
    print("지진계를 통해서만 관측 가능")
elif richter_scale >= 2.0 and richter_scale < 4.0:
    print("물건들이 흔들리거나 떨어짐")
elif richter_scale >= 4.0 and richter_scale < 7.0:
    print("빈약한 건물에 큰 피해 발생")
elif richter_scale >= 7.0 and richter_scale < 8.0:
    print("지표면에 균열이 발생")
else:
    print("대부분의 구조물이 파괴됨")