#include "superclass.h"
#include "db_event.h"
#include "player_state.h"
#include "mop_dictionary.h"

static unsigned short turn = 1;

void scrollup_motion(int initial_x, int initial_y) {
    scrollUp(initial_x, 16, initial_y);
}

void stage_1(char id[]) {
    static int initial_x = 32, initial_y = 17;
    int n = 2;
    Monster m[2] = { goblin(), slime() };
    for (int i = 0; i < n; i++) {
        memset(string, NULL, sizeof(string));
        strcpy(string, "이 튀어나왔다!");
        scrollup_motion(initial_x, initial_y);
        printAt(initial_x, initial_y, m[i].name,string);
        gotoxy(initial_x + strlen(m[i].name), initial_y);
        while (true) {
            Sleep(1000);
            long long b = ingame_select(id, m, turn);
            m[i].hp -= b;
            turn++;
            if (m[i].hp > 0) {
                continue;
            }
            else if (m[i].hp <= 0) {
                scrollup_motion(initial_x, initial_y);
                //printAt
            }
        }
    }
}
