def get_divisors(n):
    divisors = []
    for i in range(1, n):
        if n % i == 0:
            divisors.append(i)
    return divisors


def is_perfect_number(n):
    divisors = get_divisors(n)
    return sum(divisors) == n


for num in range(1, 10001):
    if is_perfect_number(num):
        divisors = get_divisors(num)
        print(f"{num}은 완전수입니다.")
        print(f"{num}의 진약수: {divisors}, 약수의 합 = {sum(divisors)}")