dictionary = {"python": "파이썬", "java": "자바", "kotlin": "코틀린", "swift": "스위프트", "ruby": "루비"}
word = input("단어를 입력하시오: ")
if word in dictionary:
    print(dictionary[word])