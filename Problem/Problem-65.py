class Movie:
    def __init__(self, title, director, rating, viewers):
        self.title = title
        self.director = director
        self.rating = rating
        self.viewers = viewers

    def add_viewer(self, count):
        self.viewers += count

    def update_rating(self, new_rating):
        if new_rating < 0 or new_rating > 5:
            print("잘못된 평점입니다")
        self.rating = new_rating

    def display_info(self):
        print("제목:", self.title)
        print("감독:", self.director)
        print("평점:", self.rating)
        print("관람객 수:", self.viewers)


obj = Movie("어벤져스", "조스웨던", 4.5, 1000)
obj.display_info()
obj.add_viewer(100)
obj.update_rating(5)
obj.display_info()