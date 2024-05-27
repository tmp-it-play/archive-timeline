#include "superclass.h"
#include "db_event.h"
#include "player_state.h"
#include "mop_dictionary.h"

void stage_1(char id[]) {
    static int initial_x = 29, initial_y = 26;
    int n = 2;
    Monster m[2] = { goblin(), slime() };
    for (int i = 0; i < n; i++) {
        scrollUp(initial_x, 25, initial_y);
        printAt(initial_x, initial_y, m[i].name);
        gotoxy(initial_x + strlen(m[i].name), initial_y);
        printf("가 튀어나왔다!");
        Sleep(1000);
    }
}