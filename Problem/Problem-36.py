stack = ["apple", "banana", "orange", "mango", "grapes", "kiwi"]


def push(element):
    stack.insert(0, element)
    return stack


def pop():
    return stack.pop(0)


print(stack)
print(push("pear"))
print(pop())