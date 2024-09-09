list_num = [10, 20, 30, 40]
list_str = ['programming', 'language', 'python']
list_mix1 = [1.5, 2.6, '문자열1', '문자열2']
list_mix2 = [4.0, True, 'abc', list_mix1]
list_empty = []
print(list_num)
print(list_str)
print(list_mix1)
print(list_mix2)
print(list_empty)
print(len(list_num))
print(len(list_str))
print(len(list_mix1))
print(len(list_mix2))
print(len(list_empty))
list_str1 = ["기술이", "강한 나라"]
list_str2 = ["우리나라", "대한민국"]
list_str3 = list_str1 + list_str2
list_str4 = list_str2 * 2
print(list_str3)
print(list_str4)
list_num1 = [100, 200, 300, 400]
print(list_num1)
list_num1[1] = 500
print(list_num1)
list_num2 = [0, 10, 20, 30, 40, 50]
print(list_num2)
del list_num2[2]
print(list_num2)
list_num3 = [0, 1, 2, 3]
print(2 in list_num3)
print(5 in list_num3)
friends = ['토마스']
print(friends)
friends.append('고든')
print(friends)
friends.insert(1, '퍼시')
print(friends)

friends.extend(['빌', '벤'])
print(friends)
friends.remove('퍼시')
print(friends)
friends.pop()
print(friends)
