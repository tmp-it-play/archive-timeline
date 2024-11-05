from tkinter import *

window = Tk()
window.title("Calculator")
e = Entry(window, width=15, borderwidth=5, bg="yellow")
e.grid(row=0, column=0, columnspan=4)


def click(number):
    current = e.get()
    e.delete(0, END)
    e.insert(0, current + str(number))


def clear():
    e.delete(0, END)


def evaluate():
    try:
        result = str(eval(e.get()))
        e.delete(0, END)
        e.insert(0, result)
    except:
        e.delete(0, END)
        e.insert(0, "Error")


buttons = [
    ('1', 1, 0), ('2', 1, 1), ('3', 1, 2), ('/', 1, 3),
    ('4', 2, 0), ('5', 2, 1), ('6', 2, 2), ('*', 2, 3),
    ('7', 3, 0), ('8', 3, 1), ('9', 3, 2), ('-', 3, 3),
    ('0', 4, 0), ('.', 4, 1), ('=', 4, 2), ('+', 4, 3),
    ('C', 5, 0), (' ', 5, 1), (' ', 5, 2), (' ', 5, 3)
]
for (text, row, col) in buttons:
    if text == '=':
        button = Button(window, text=text, width=3, command=evaluate)
    elif text == 'C':
        button = Button(window, text=text, width=3, command=clear)
    elif text == ' ':
        button = Button(window, text=text, width=3, state=DISABLED)
    else:
        button = Button(window, text=text, width=3, command=lambda t=text: click(t))
    button.grid(row=row, column=col)
window.mainloop()