#include "superclass.h"
#include "player_state.h"
#include "db_event.h"
#include "mop_dictionary.h"

long long into_battle(char id[], Monster m[], unsigned short stage_turn);

long long ingame_select(char id[], Monster m[], unsigned short turn) {
    int x = 37, y = 23;
    gotoxy(37, 23);
    printf("> 공격하기");
    gotoxy(54, 23);
    printf("랜덤 물약 던지기");
    gotoxy(77, 23);
    printf("랜덤 물약 마시기");
    gotoxy(102, 23);
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
            if (x == 37) {
                long long d = into_battle(id, m, turn);
                return d;
            }
            exit(1);
        }
        default: {
            break;
        }
        }
    }
}

long long into_battle(char id[], Monster m[], unsigned short stage_turn) {
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0)) {
        gotoxy(42, 12);
        db_connect_error(&db);
        exit(0);
    }
    char q[255];
    sprintf(q, "SELECT attack FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
        exit(0);
    }
    MYSQL_RES* res = mysql_store_result(&db);
    MYSQL_ROW row = mysql_fetch_row(res);
    int attack = atoi(row[0]);
    mysql_free_result(res);
    mysql_close(&db);
    long long damage = attack - m[stage_turn].defense + 2;
    if (damage < 0) {
		damage = 0;
    }
    else if (damage == 0) {
        damage = 1;
    }
    memset(string, NULL, sizeof(string));
	return damage;
}