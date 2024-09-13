def mean_of_n(*nums):
    return sum(nums) / len(nums)


def max_of_n(*nums):
    return max(nums)


def min_of_n(*nums):
    return min(nums)


*nums, = map(int, input("정수를 여러 개 입력하시오 : ").split())
print(f"{mean_of_n(*nums):.2f}")
print(f"최댓값은 {max_of_n(*nums)}")
print(f"최솟값은 {min_of_n(*nums)}")