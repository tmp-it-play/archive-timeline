scores = [85, 90, 78, 92, 88, 76, 95]


def average(scores):
    return sum(scores) / len(scores)


print(f"{average(scores):.2f}")