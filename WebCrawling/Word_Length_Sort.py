def word_length_sort():
    string = list(map(str, input().split()))
    string.sort(key=lambda x: len(x))
    return string


print(word_length_sort())