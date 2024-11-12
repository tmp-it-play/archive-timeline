class Library:
    total_books = 0

    def __init__(self, name, books):
        self.name = name
        self.books = books

    def add_books(self, count):
        self.books += count
        Library.total_books += count

    def remove_books(self, count):
        if self.books < count:
            print("책이 부족합니다")
            return
        self.books -= count
        Library.total_books -= count

    def display_info(self):
        print(self.name, ":", self.books, "권", "총", Library.total_books, "권")


library1 = Library("중앙 도서관", 100)
library2 = Library("서부 도서관", 50)
library1.display_info()
library2.display_info()
library1.add_books(30)
library2.remove_books(20)
print("\n책 추가 및 제거 후:")
library1.display_info()
library2.display_info()