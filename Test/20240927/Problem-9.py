animals = ['dog', 'cat', 'tiger', 'lion']
print(f"animals = {animals}")


def list_shift(lists):
    temp = lists[0]
    for i in range(0, len(lists) - 1):
        lists[i] = lists[i + 1]
    lists[-1] = temp
    return lists


animals = list_shift(animals)
print(f"animals = {animals}")

animals = ['dog', 'cat', 'tiger', 'lion']


def lova_animal(animals):
    for i in range(0, len(animals)):
        print(f"I lova {animals[i]}.")


print(f"animals = {animals}")
lova_animal(animals)