#include "superclass.h"

void info_area(char id[]);

void outline(char id[]) {
    Program_config();
    for (int i = 0; i < 120; i++) {
        printf("бс");
    }
    puts("");
    for (int i = 1; i <= 28; i++) {
        printf("бс");
        for (int j = 0; j < 118; j++) {
            printf(" ");
        }
        printf("бс\n");
    }
    gotoxy(0, 29);
    for (int i = 0; i < 120; i++) {
        printf("бс");
    }
    puts(" ");
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
    gotoxy(0, 27);
    for (int i = 0; i < 120; i++) {
        printf("бс");
    }
    game_core_code(id);
}
