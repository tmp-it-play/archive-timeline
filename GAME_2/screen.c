#include "superclass.h"

void info_area(char id[]);

void outline(char id[]) {
    Program_config();
    for (int i = 0; i < 120; i++) {
        printf("бс");
    }
    printf("\n");
    for (int i = 1; i <= 28; i++) {
        printf("бс");
        for (int j = 0; j < 118; j++) {
            printf(" ");
        }
        printf("бс\n");
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
        printf("бс");
    }
    puts(" ");
    gotoxy(1, 22);
    for (int i = 0; i < 27; i++) {
        gotoxy(i, 22);
        printf("бс");
    }
    for (int i = 0; i < 27; i++) {
        gotoxy(i, 12);
        printf("бс");
    }
    gotoxy(0, 27);
    for (int i = 0; i < 120; i++) {
        printf("бс");
    }
    for (int i = 0; i < 27; i++) {
        gotoxy(27, i);
        printf("бс");
    }
    for (int i = 27; i < 119; i++) {
        gotoxy(i, 19);
        printf("бс");
    }
    Reline();
    game_core_code(id);
}

void ClearViewState(void) {
    for (int i = 14; i <= 20; i++) {
        clearLine(2, i);
    }
    for (int i = 24; i <= 26; i++) {
        clearLine(2, i);
    }
}

void Reline(void) {
    CursorView(0);
    Program_config();
    for (int i = 0; i < 120; i++) {
        printf("бс");
    }
    printf("\n");
    for (int i = 1; i <= 28; i++) {
        printf("бс");
        for (int j = 0; j < 118; j++) {
            printf(" ");
        }
        printf("бс\n");
    }
    gotoxy(0, 29);
    printf("\n");
    int y = 0;
    for (int i = 0; i < 28; i++) {
        gotoxy(27, y + i);
        printf("бс");
    }
    puts(" ");
    gotoxy(1, 22);
    for (int i = 0; i < 27; i++) {
        gotoxy(i, 22);
        printf("бс");
    }
    for (int i = 0; i < 27; i++) {
        gotoxy(i, 12);
        printf("бс");
    }
    gotoxy(0, 27);
    for (int i = 0; i < 120; i++) {
        printf("бс");
    }
    for (int i = 0; i < 27; i++) {
        gotoxy(27, i);
        printf("бс");
    }
    for (int i = 27; i < 119; i++) {
        gotoxy(i, 19);
        printf("бс");
    }
}