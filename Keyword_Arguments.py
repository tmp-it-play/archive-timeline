def myfunc(**kwargs):
    result = ""
    for arg in kwargs.values():
        result += arg
    return result


print(myfunc(a="Hi", b="Mr.", c="Kim"))