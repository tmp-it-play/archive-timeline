#include "superclass.h"

void Gamemenu(void) {
    ASCII_Art_print();
    CursorView(0);
    int x = 50, y = 16;
    gotoxy(x, y);
    printf("> 게임 새로하기");
    gotoxy(x + 2, y + 1);
    printf("로그아웃");
    gotoxy(x + 2, y + 2);
    printf("종료");
    while (true) {
        int n = KeyControl();
        switch (n) {
        case UP:
            gotoxy(x, y);
            printf(" ");
            if (y > 16) {
                y--;
            }
            else {
                y = 18;
            }
            gotoxy(x, y);
            printf(">");
            break;
        case DOWN:
            gotoxy(x, y);
            printf(" ");
            if (y < 18) {
                y++;
            }
            else {
                y = 16;
            }
            gotoxy(x, y);
            printf(">");
            break;
        case SUBMIT:
            system("cls");
            if (y - 16 == 0) {
                new_game_reconfirm();
            }
            else if (y - 16 == 1) {
                sign_up();
            }
            else if (y - 16 == 2) {
                program_off();
                return 1;
            }
            printf("Selected Option: %d\n", y - 16);
        default:
            break;
        }
    }
}