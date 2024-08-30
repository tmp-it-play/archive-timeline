cough = input("기침이 있으면 Y입력, 기침이 없으면 N입력 :")
fever = float(input("체온이 몇 도 인가요? "))
if cough == "Y" and fever >= 37.5:
    print("코로나에 감염되었을 수 있습니다. 선별진료소를 방문하여 검사하세요.")