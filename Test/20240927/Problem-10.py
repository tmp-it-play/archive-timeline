s_list = ['abc', 'bcd', 'bcdefg', 'abba', 'cddc', 'opq']


def long_string(s_list):
    long = s_list[0]
    for i in range(0, len(s_list)):
        if len(long) < len(s_list[i]):
            long = s_list[i]
    return long


def short_string(s_list):
    short = s_list[0]
    for i in range(0, len(s_list)):
        if len(short) > len(s_list[i]):
            short = s_list[i]
    return short


print(f"가장 길이가 짧은 문자열: {short_string(s_list)}")
print(f"가장 길이가 긴 문자열: {long_string(s_list)}")