import turtle

t = turtle.Turtle()
t.shape("turtle")
t.speed(50)
radius = 100
colors = ["red", "blue", "green", "yellow", "purple", "orange", "black", "white", "pink", "brown"]
for i in range(10):
    t.color(colors[i])
    t.circle(radius)
    t.fd(30)
turtle.mainloop()
turtle.bye()
bool = True
print(type(bool))