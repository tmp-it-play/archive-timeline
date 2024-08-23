attendees=int(input("파티 참석인원: "))
chicken=attendees*9000
coke=attendees*2*400
potato_chips=attendees*700
total=chicken+coke+potato_chips
chicken=attendees
coke=attendees*2
potato_chips=attendees
print(f"치킨 {chicken}마리\n콜라 {coke}캔\n감자칩 {potato_chips}개\n총 금액 {total}원")