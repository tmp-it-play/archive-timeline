def transposed_matrix(matrix):
    rows = len(matrix)
    cols = len(matrix[0])
    new_matrix = [[0] * rows for row in range(cols)]
    for r in range(rows):
        for c in range(cols):
            new_matrix[c][r] = matrix[r][c]
    return new_matrix


origin_list = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(transposed_matrix(origin_list))