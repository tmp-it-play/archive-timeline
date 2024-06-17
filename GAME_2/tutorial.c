#include "superclass.h"

void tutorial(char id[]) {
	system("cls");
	CursorView(0);
	Reline();
    unsigned int bar_length = 10;
    int hp = 999, max_hp = 999, mp = 999, max_mp = 999;
    gotoxy(17, 24);
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 10);
    printf("[%lld/%lld]", hp, max_hp);
    gotoxy(2, 24);
    printf("HP[");
    double hp_percentage = (double)hp / max_hp;
    unsigned int filled_length = (unsigned int)(hp_percentage * bar_length);
    gotoxy(2, 24);
    printf("HP[");
    for (unsigned int i = 0; i < bar_length; i++) {
        if (i < filled_length) {
            printf("■");
        }
        else {
            printf(" ");
        }
    }
    printf("]");
    gotoxy(17, 25);
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 1);
    printf("[%lld/%lld]", mp, max_mp);
    gotoxy(2, 25);
    printf("MP[");
    double mp_percentage = (double)mp / max_mp;
    unsigned int filled_mp_length = (unsigned int)(mp_percentage * bar_length);
    gotoxy(2, 25);
    gotoxy(2, 25);
    printf("MP[");
    for (unsigned int i = 0; i < bar_length; i++) {
        if (i < filled_mp_length) {
            printf("■");
        }
        else {
            printf(" ");
        }
    }
    gotoxy(15, 25);
    printf("]");
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
    gotoxy(2, 15);
    printf("HP:999");
    gotoxy(2, 16);
    printf("MP:999");
    gotoxy(2, 17);
    printf("공격력:600");
    gotoxy(2, 18);
    printf("방어력:145");
    gotoxy(2, 19);
    printf("회피률:15%%");
    gotoxy(2, 20);
    printf("치명타 확률:45%%");
    gotoxy(2, 14);
    int player_level = 20, levelup_point = 0, levelup_requirement = 3000;
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 10);
    printf("Lv.%lld[%lld/%lld]", player_level, levelup_point, levelup_requirement);
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);

}