gx = 100


def myfunc():
    global gx
    gx = 200
    print(gx)


myfunc()
print(gx)