class Counter:
    def __init__(self,initValue=0):
        self.count = initValue

    def increment(self):
        self.count += 1

    def decrement(self):
        self.count -= 1


a = Counter()
a.increment()
a.increment()
print("카운터의 값=", a.count)
b = Counter(5)
b.increment()
b.increment()
b.decrement()
print("카운터의 값=", b.count)