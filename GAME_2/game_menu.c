#include "superclass.h"

void Gamemenu(char id[]) {
    int x = 53, y = 16;
    bool menu_active = true;
    while (menu_active) {
        ASCII_Art_print();
        CursorView(0);
        gotoxy(x, y);
        printf("> 게임 새로하기");
        gotoxy(x+2, y + 1);
        printf("게임 이어하기");
        gotoxy(x + 4.5, y + 2);
        printf("튜토리얼");
        gotoxy(x + 4.5, y + 3);
        printf("로그아웃");
        gotoxy(x + 6, y + 4);
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
                    y = 20;
                }
                gotoxy(x, y);
                printf(">");
                break;
            case DOWN:
                gotoxy(x, y);
                printf(" ");
                if (y < 20) {
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
                if (y == 16) {
                    new_game_reconfirm(id);
                    menu_active = false;
                }
                else if (y == 17) {
                    save_check(id);
                }
                else if (y == 18) {
                    tutorial(id);
                }
                else if (y == 19) {
                    main();
                    menu_active = false;
                }
                else if (y == 20) {
                    program_off();
                    menu_active = false;
                }
                break;
            default:
                break;
            }
            if (!menu_active) {
                break;
            }
        }
    }
}