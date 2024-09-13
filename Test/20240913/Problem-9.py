def my_sort(*args):
    return sorted(args)


tuple = tuple(map(int, input().split()))
print(f"my_sort{tuple}")
print(f"결과 : {my_sort(*tuple)}")