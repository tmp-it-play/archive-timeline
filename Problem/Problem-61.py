class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def calculateArea(self):
        return self.width * self.height


r = Rectangle(4, 5)
print(r.calculateArea())