s = "North Atlantic Treaty Organization"

def upper_select(s):
    return ''.join([i for i in s if i.isupper()])
print(upper_select(s))