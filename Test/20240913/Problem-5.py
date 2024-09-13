def sum_nums(*args):
    print(f"{len(args)}개의 인자{args}")
    print(f"합계 : {sum(args)}, 평균 : {sum(args) / len(args)}")


sum_nums(10, 20, 30)
sum_nums(10, 20, 30, 40, 50)