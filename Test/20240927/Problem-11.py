s_list = ['abc', 'bcd', 'abc', 'abba', 'cddc', 'opq', 'opq']


def deduplication(s_list):
    result = []
    for i in range(0, len(s_list)):
        if s_list[i] not in result:
            result.append(s_list[i])
    return result


print("s_list =", s_list)
print("new_s_list =", deduplication(s_list))