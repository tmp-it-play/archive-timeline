#include "superclass.h"
#include "player_state.h"
#include "mop_dictionary.h"

static unsigned short turn = 0;

void scrollup_motion(int initial_x, int initial_y) {
    scrollUpImproved(initial_x, 2, initial_y);
}

void stage_1(char id[]) {
    static int initial_x = 32, initial_y = 17, mop_hp;
    int n = 2;
    char string[256];
    Monster m[2] = { goblin(), slime() };
    for (int i = 0; i < n; i++) {
        unsigned char match_turn = false;
        if (i > 0) {
            scrollup_motion(initial_x, initial_y);
        }
        memset(string, 0, sizeof(string));
        sprintf(string, "%s이 튀어나왔다!", m[i].name);
        printAt(initial_x, initial_y, string);
        mop_hp = m[i].hp;
        while (true) {
            ClearViewState();
            now_level(id);
            now_state(id);
            long long b = ingame_select(id, m, turn, initial_x, initial_y);
            mop_hp -= b;
            turn++;
            match_turn = true;
            if (mop_hp > 0) {
                if (match_turn == true) {
                    mop_turn(id, m, i, initial_x, initial_y);
                }
                continue;
            }
            else if (mop_hp <= 0) {
                memset(string, 0, sizeof(string));
                sprintf(string, "%s를 처치했다!", m[i].name);
                scrollup_motion(initial_x, 17);
                printAt(initial_x, initial_y, string);
                gotoxy(initial_x + strlen(string), initial_y);
            }
            break;
        }
    }
}