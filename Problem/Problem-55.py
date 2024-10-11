import random

def otp():
    otp = ""
    for i in range(4):
        otp += str(random.sample(range(0, 10), 1)[0])
    return otp

print(otp())