from tkinter import *
from PIL import Image, ImageTk

def display_poster(image_path, movie_title, song_title):
    img = Image.open(image_path).resize((180, 250))
    photo = ImageTk.PhotoImage(img)

    label_image = Label(window, image=photo)
    label_image.image = photo
    label_image.grid(row=5, column=0, columnspan=2, rowspan=2)
    e3.delete(0, END)
    e3.insert(0, movie_title)
    e4.delete(0, END)
    e4.insert(0, song_title)

def search_country():
    country = str(e1.get())
    if country == "한국":
        display_poster("Y:/PythonStudy/Problem/Problem-57(img)/chicken.png", "마당을 나온 암탉", "바람의 멜로디")
    elif country == "미국":
        display_poster("Y:/PythonStudy/Problem/Problem-57(img)/lalaland.png", "라라랜드", "City of Stars")
    elif country == "일본":
        display_poster("Y:/PythonStudy/Problem/Problem-57(img)/cal.png", "너의 이름은", "인생의 회전목마")
    else:
        print("해당 국가의 영화가 없습니다.")

def search_genre():
    genre = str(e2.get())
    if genre == "액션":
        display_poster("Y:/PythonStudy/Problem/Problem-57(img)/john-wick.png", "존 윅", "Killing Strangers")
    elif genre == "애니메이션":
        display_poster("Y:/PythonStudy/Problem/Problem-57(img)/rafungel.png", "라푼젤", "I See the Light")
    elif genre == "로맨스":
        display_poster("Y:/PythonStudy/Problem/Problem-57(img)/about-time.png", "어바웃 타임", "How Long Will I Love You")
    else:
        print("해당 장르의 영화가 없습니다.")

window = Tk()
Label(window, text="국가(한국,미국,일본)").grid(row=0, column=0)
Label(window, text="장르(액션,애니메이션,로맨스)").grid(row=1, column=0)
Label(window, text="영화 제목").grid(row=2, column=0)
Label(window, text="노래 제목").grid(row=3, column=0)

e1 = Entry(window, width=30)
e1.grid(row=0, column=1)
e2 = Entry(window, width=30)
e2.grid(row=1, column=1)
e3 = Entry(window, width=30)
e3.grid(row=2, column=1)
e4 = Entry(window, width=30)
e4.grid(row=3, column=1)

b1 = Button(window, text="검색", command=search_country)
b1.grid(row=0, column=2)
b2 = Button(window, text="검색", command=search_genre)
b2.grid(row=1, column=2)

window.mainloop()