def weeklyPay(hourly_pay, hourly_work):
    if hourly_work < 30:
        return hourly_pay * hourly_work
    else:
        return hourly_pay * 30 + (hourly_work - 30) * hourly_pay * 1.5


hourly_pay = int(input("시급을 입력하시오:"))
hourly_work = int(input("근무 시간을 입력하시오:"))
print(f"주급은 {weeklyPay(hourly_pay, hourly_work)}")