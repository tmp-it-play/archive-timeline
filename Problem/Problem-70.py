import random

import pandas as pd
import plotly.express as px


class Dice:
    def __init__(self, x, y):
        self.__x = x
        self.__y = y
        self.__size = 30
        self.__value = 1

    def read_dice(self):
        return self.__value

    def print_dice(self):
        print("주사위의 값:", self.__value)

    def roll_dice(self):
        self.__value = random.randint(1, 6)


history = []
obj = Dice(0, 1)
obj.print_dice()
for i in range(1000000):
    obj.roll_dice()
    history.append(obj.read_dice())
    obj.print_dice()
frequency = pd.Series(history).value_counts().sort_index()
df = pd.DataFrame({"Dice Value": frequency.index, "Frequency": frequency.values})
fig = px.bar(df, x="Dice Value", y="Frequency", title="Frequency of Each Dice Value (1-6)")
fig.write_image("Dice_Frequency.png")