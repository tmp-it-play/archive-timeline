class ShoppingCart:
    def __init__(self, *items):
        self.items = list(items)

    def add_item(self, item):
        self.items.append(item)

    def remove_item(self, item):
        try:
            self.items.remove(item)
        except ValueError:
            print("상품이 카트에 없습니다")

    def view_cart(self):
        for item in self.items:
            print(item)


obj = ShoppingCart("사과", "바나나", "딸기")
obj.add_item("수박")
obj.remove_item("바나나")
obj.view_cart()
obj.remove_item("황지훈")