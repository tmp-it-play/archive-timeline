def overlapping_list_sum(a):
    sum = 0
    for i in range(len(a)):
        for j in range(len(a[i])):
            sum += a[i][j]
    return sum


a = [[1, 2, 3], [4, 5], [6, 7, 8]]
print(overlapping_list_sum(a))