#include "superclass.h"
#include "player_state.h"
#include "db_event.h"
#include "mop_dictionary.h"

long long into_battle(char id[], Monster m[], unsigned short stage_turn, int x, int y);

long long ingame_select(char id[], Monster m[], unsigned short turn, int ix, int iy) {
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
            } else if (x == 37) {
                x = 52;
            } else if (x == 52) {
                x = 75;
            } else {
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
            } else if (x == 100) {
                x = 75;
            } else if (x == 75) {
                x = 52;
            } else {
                x = 37;
            }
            gotoxy(x, y);
            printf(">");
            break;
        }
        case SUBMIT: {
            if (x == 37) {
                long long d = into_battle(id, m, turn, ix, iy);
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

long long into_battle(char id[], Monster m[], unsigned short stage_turn, int x, int y) {
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    DWORD dwMode = 0;
    GetConsoleMode(hOut, &dwMode);
    dwMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
    SetConsoleMode(hOut, dwMode);
    MYSQL* db;
    db = mysql_init(NULL);
    if (db == NULL) {
        fprintf(stderr, "mysql_init() failed\n");
        return 1;
    }
    if (mysql_real_connect(db, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0) == NULL) {
        fprintf(stderr, "mysql_real_connect() failed\n");
        mysql_close(db);
        return 1;
    }
    char q[255];
    sprintf(q, "SELECT attack,cri_chance FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
    if (mysql_query(db, q)) {
        fprintf(stderr, "SELECT error: %s\n", mysql_error(db));
        mysql_close(db);
        return 1;
    }
    MYSQL_RES* res = mysql_store_result(db);
    if (res == NULL) {
        fprintf(stderr, "mysql_store_result() failed: %s\n", mysql_error(db));
        mysql_close(db);
        return 1;
    }
    MYSQL_ROW row = mysql_fetch_row(res);
    if (row == NULL) {
        fprintf(stderr, "mysql_fetch_row() failed: %s\n", mysql_error(db));
        mysql_free_result(res);
        mysql_close(db);
        return 1;
    }
    int attack = atoi(row[0]);
    int crit = atoi(row[1]);
    srand(time(NULL));
    long long damage = 0;
    if (cri_chance(crit)) {
        damage = attack * 2;
        memset(string, 0, sizeof(string));
        setRGBColor(255, 255, 153);
        strcpy(string, "치명타!!!");
        scrollUpImproved(x, 2, y);
        printAt(x, y, string);
        gotoxy(x + strlen(string), y);
    }
    else {
        damage = attack - m[stage_turn].defense + 2;
    }
    if (damage < 0) {
        damage = 0;
    }
    else if (damage == 0) {
        damage = 1;
    }
    memset(string, 0, sizeof(string));
    sprintf(string, "%lld의 대미지를 가했다!", damage);
    resetColor();
    scrollUpImproved(x, 2, y);
    printAt(x, y, string);
    gotoxy(x + strlen(string), y);
    mysql_free_result(res);
    mysql_close(db);
    return damage;
}

int cri_chance(int crit) {
    int compare_num = rand() % 100;
    if(compare_num < crit) {
		return 1;
	}
    return 0;
}

long long mop_turn(char id[], Monster m[], unsigned short stage_turn, int x, int y) {
    long long damage;
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
        db_connect_error(&db);
        return 1;
    }
    char q[255];
    sprintf(q, "SELECT hp FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
		return 1;
    }
    MYSQL_RES* res = mysql_store_result(&db);
    MYSQL_ROW row = mysql_fetch_row(res);
    if (row == NULL) {
		db_result_value_error();
		return 1;
	}
    int hp = atoi(row[0]);
    if (!strcmp("고블린", m[stage_turn].name)) {
        damage = goblin_skill_1();
        hp-=damage;
	}
	else if(!strcmp("슬라임",m[stage_turn].name)) {
		slime_skill_1();
        return 0;
	}
	else if(strcmp("박쥐",m[stage_turn].name) == 0) {
        srand(time(NULL));
        int random1 = rand() % 3;
        int random2 = rand() % 10;
        if(random1>=random2){
            damage = bat_skill_1();
            if (damage == 5) {
                return 1;
			}
        }
		else{
            damage = bat_skill_2();
		}
	}
	/*else if(strcmp("오크",m[stage_turn].name) == 0) {
		oak_skill_1();
	}
	else if(strcmp("늑대인간",m[stage_turn].name) == 0) {
		wolfman_skill_1();
	}
	else if(strcmp("흑마술사",m[stage_turn].name) == 0) {
		magician_skill_1();
	}
	else if(strcmp("드래곤",m[stage_turn].name) == 0) {
		dragon_skill_1();
	}*/
    if (hp > 0) {
        memset(q, 0, sizeof(q));
        sprintf(q, "UPDATE gwangju_sword_master.user_state SET hp = %d WHERE id = '%s'", hp, id);
        if (mysql_query(&db, q)) {
            db_query_error(&db);
            return 1;
        }
        mysql_free_result(res);
        mysql_close(&db);
    }
	else if (hp <= 0) {
		//회귀코드 작성
	}
	return 0;
}

void mop_hp_bar(int mop_hp, int mop_max_hp, int x, int y, char name[]) {
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
    int bar_width = 35;
    int filled_length = (mop_hp * bar_width) / mop_max_hp;
    gotoxy(x, y);
    printf("%s[", name);
    for (int i = 0; i < bar_width; i++) {
        if (i < filled_length) {
            printf("■");
        }
        else {
            printf(" ");
        }
    }
    printf("]");
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
}

void drop_booty(char id[], char name[]) {
    int drop_exp;
    srand(time(NULL));
    if (!strcmp("고블린", name)) {
        drop_exp = rand() % 20 + 1;
        while (drop_exp <= 5) {
            drop_exp = rand() % 20 + 1;
        }
    }
    else if (!strcmp("슬라임", name)) {
        drop_exp = rand() % 10 + 1;
        while (drop_exp <= 3) {
            drop_exp = rand() % 10 + 1;
        }
    }
    else if (!strcmp("박쥐", name)) {
        drop_exp = rand() % 30 + 1;
        while (drop_exp <= 10) {
            drop_exp = rand() % 30 + 1;
        }
    }
    else if (!strcmp("오크", name)) {
        drop_exp = rand() % 50 + 1;
        while (drop_exp <= 20) {
            drop_exp = rand() % 50 + 1;
        }
    }
    else if (!strcmp("늑대인간", name)) {
        drop_exp = rand() % 60 + 1;
        while (drop_exp <= 30) {
            drop_exp = rand() % 60 + 1;
        }
    }
    else if (!strcmp("흑마술사", name)) {
        drop_exp = rand() % 70 + 1;
        while (drop_exp <= 40) {
            drop_exp = rand() % 70 + 1;
        }
    }
    else if (!strcmp("드래곤", name)) {
        drop_exp = rand() % 100 + 1;
        while (drop_exp <= 50) {
            drop_exp = rand() % 100 + 1;
        }
    }
    else {
        drop_exp = 0;
    }
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
        db_connect_error(&db);
        return;
    }
    char q[255];
    sprintf(q, "UPDATE gwangju_sword_master.user_state SET levelup_point = levelup_point + %d WHERE id = '%s'", drop_exp, id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    sprintf(q, "SELECT levelup_point, levelup_requirement FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    MYSQL_RES* res = mysql_store_result(&db);
    MYSQL_ROW row = mysql_fetch_row(res);
    if (row == NULL) {
        db_result_value_error();
        mysql_free_result(res);
        mysql_close(&db);
        return;
    }
    int levelup_point = atoi(row[0]);
    int levelup_requirement = atoi(row[1]);
    mysql_free_result(res);
    if (levelup_point >= levelup_requirement) {
        sprintf(q, "UPDATE gwangju_sword_master.user_state SET levelup_point = 0, levelup_requirement = levelup_requirement + 150, level = level + 1 WHERE id = '%s'", id);
        if (mysql_query(&db, q)) {
            db_query_error(&db);
            mysql_close(&db);
            return;
        }
    }
    mysql_close(&db);
}