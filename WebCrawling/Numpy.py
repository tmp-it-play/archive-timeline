import numpy as np

list_data = [0, 1, 2, 3, 4, 5.0]
a1 = np.array(list_data)
print(a1)
a2 = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(a2)
print("--------------------")
print(np.linspace(1, 10, 10))
print(np.linspace(0, np.pi, 20))
print("--------------------")
a1 = np.array([0, 10, 20, 30, 40, 50])
print([a1[0], a1[3], a1[5], a1[-1], a1[-2]])
a1[4] = 90