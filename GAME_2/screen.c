#include "superclass.h"

void info_area(char id[]);

void outline(char id[]) {
    Program_config();
    for (int i = 0; i < 120; i++) {
        printf("■");
    }
    printf("\n");
    for (int i = 1; i <= 28; i++) {
        printf("■");
        for (int j = 0; j < 118; j++) {
            printf(" ");
        }
        printf("■\n");
    }
    gotoxy(0, 29);
    printf("\n");
    info_area(id);
    exit(1);
}

void info_area(char id[]) {
    int y = 0;
    for (int i = 0; i < 28; i++) {
        gotoxy(27, y + i);
        printf("■");
    }
    puts(" ");
    gotoxy(1, 22);
    for (int i = 0; i < 27; i++) {
        gotoxy(i, 22);
        printf("■");
    }
    for (int i = 0; i < 27; i++) {
        gotoxy(i, 12);
        printf("■");
    }
    gotoxy(27, 17);
    for (int i = 0; i < 93; i++) {
        printf("■");
    }
    gotoxy(0, 27);
    for (int i = 0; i < 120; i++) {
        printf("■");
    }
    for (int i = 0; i < 27; i++) {
        gotoxy(27, i);
        printf("■");
    }
    for (int i = 27; i < 119; i++) {
        gotoxy(i, 21);
        printf("■");
    }
    game_core_code(id);
}

void ingame_select(void) {
    int x = 37, y = 19;
    gotoxy(37, 19);
    printf("> 공격하기");
    gotoxy(54, 19);
    printf("랜덤 물약 던지기");
    gotoxy(77, 19);
    printf("랜덤 물약 마시기");
    gotoxy(102, 19);
    printf("도망가기");
    while (true) {
        int n = KeyControl();
        switch (n) {
        case RIGHT: {
            gotoxy(x, y);
            printf(" ");
            if (x >= 100) {
                x = 37;
            }
            else if (x == 37) {
                x = 52;
            }
            else if (x == 52) {
                x = 75;
            }
            else {
                x = 100;
            }
            gotoxy(x, y);
            printf(">");
            break;
        }
        case LEFT: {
            gotoxy(x, y);
            printf(" ");
            if (x == 37) {
                x = 100;
            }
            else if (x == 100) {
                x = 75;
            }
            else if (x == 75) {
                x = 52;
            }
            else {
                x = 37;
            }
            gotoxy(x, y);
            printf(">");
            break;
        }
        case SUBMIT: {
            exit(1);
        }
        default: {
            break;
        }
        }
    }
}