fine_dust = int(input("미세먼지 농도를 입력하세요: "))
if fine_dust >= 0 and fine_dust <= 15:
    print("좋음")
elif fine_dust >= 16 and fine_dust <= 35:
    print("보통")
elif fine_dust >= 36 and fine_dust <= 75:
    print("나쁨")
else:
    print("매우 나쁨")