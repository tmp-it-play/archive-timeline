class Warehouse:
    def __init__(self, capacity):
        self.__items = dict()
        self.__capacity = capacity

    def get_items(self):
        return self.__items

    def get_capacity(self):
        return self.__capacity

    def set_capacity(self, capacity):
        self.__capacity = capacity

    def add_item(self, item, quantity):
        if self.__capacity < quantity:
            print("창고 용량 초과로 추가할 수 없습니다")
            return
        if item in self.__items:
            self.__items[item] += quantity
        else:
            self.__items[item] = quantity

    def remove_item(self, item, quantity):
        if item not in self.__items or self.__items[item] < quantity:
            print("상품이 부족합니다")
            return
        self.__items[item] -= quantity
        if self.__items[item] == 0:
            del self.__items[item]

    def display_items(self):
        for item, quantity in self.__items.items():
            print(item, ":", quantity, "개")


warehouse = Warehouse(100)
warehouse.add_item("사과", 30)
warehouse.add_item("바나나", 20)
warehouse.add_item("오렌지", 60)
warehouse.display_items()
warehouse.remove_item("사과", 10)
warehouse.remove_item("바나나", 25)
warehouse.display_items()
warehouse.set_capacity(150)
warehouse.add_item("오렌지", 50)
warehouse.display_items()