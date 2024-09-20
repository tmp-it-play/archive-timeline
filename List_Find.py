temps = [28, 31, 33, 35, 27, 26, 25]
for x in range(len(temps)):
    print(temps[x], end=', ')
print()
for element in temps:
    print(element, end=', ')
print()
questions = ['name', 'quest', 'color']
answers = ['Kim', '파이썬', 'blue']
for q, a in zip(questions, answers):
    print(f'What is your {q}? It is {a}')