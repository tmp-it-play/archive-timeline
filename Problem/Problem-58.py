from math import pi


class Circle:
    def __init__(self, radius=0):
        self.radius = radius

    def getArea(self):
        return pi * pow(self.radius, 2)

    def getPerimeter(self):
        return 2 * pi * self.radius


circle = Circle(10)
print("원의 면적", circle.getArea())
print("원의 둘레", circle.getPerimeter())