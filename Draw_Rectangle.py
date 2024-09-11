import turtle

t = turtle.Turtle()
t.shape("turtle")


def square(length):
    for i in range(4):
        t.down()
        for x in range(4):
            t.forward(length)
            t.left(90)
        t.up()


square(100)
t.forward(120)
square(100)
t.forward(120)
square(100)
turtle.mainloop()
turtle.bye()