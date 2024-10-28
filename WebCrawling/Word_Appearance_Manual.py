a = {}
string = list(map(str, input().split()))


def word_appearance_manual_dict(a):
    for i in string:
        if i in a:
            a[i] += 1
        else:
            a[i] = 1
    return a


print(word_appearance_manual_dict(a))