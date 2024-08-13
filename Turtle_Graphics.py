import turtle
import random

colors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'white', 'pink', 'brown', 'cyan']
# n1= random.randint(50, 100)
t = turtle.Turtle()
turtle.bgcolor("black")
t.speed(0)
t.width(3)
length = 10
while length < 500:
    t.forward(length)
    t.pencolor(colors[length % 10])
    t.right(86)
    length += 9
turtle.mainloop()
turtle.bye()

