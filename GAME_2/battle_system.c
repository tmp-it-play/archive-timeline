#include "superclass.h"
#include "player_state.h"
#include "db_event.h"
#include "mop_dictionary.h"
#include "color.h"

long long into_battle(char id[], Monster m[], unsigned short stage_turn, int x, int y);
void Runaway(char id[], Monster m[], unsigned short stage_turn, int x, int y);

long long ingame_select(char id[], Monster m[], unsigned short turn, int ix, int iy) {
    static int x = 37, y = 23;
    while (true) {
        gotoxy(x, y);
        printf(">");
        gotoxy(39, 23);
        printf("공격하기");
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
                    MYSQL db;
                    mysql_init(&db);
                    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
                        db_connect_error(&db);
                        return;
                    }
                    char q[255];
                    memset(q, 0, sizeof(q));
                    sprintf(q, "SELECT mp FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
                    if (mysql_query(&db, q)) {
						db_query_error(&db);
                        mysql_close(&db);
                        exit(1);
					}
                    MYSQL_RES* res = mysql_store_result(&db);
                    MYSQL_ROW row = mysql_fetch_row(res);
                    if (row == NULL) {
                        db_result_value_error();
                        mysql_free_result(res);
                        mysql_close(&db);
                        exit(1);
                    }
                    int now_mp = atoi(row[0]);
                    if (now_mp <= 3) {
                        memset(string, 0, sizeof(string));
						strcpy(string, "마나가 부족합니다!");
						scrollUpImproved(ix, 2, iy);
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), RED);
						printAt(ix, iy, string);
						gotoxy(ix + strlen(string), iy);
						mysql_free_result(res);
						mysql_close(&db);
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
						return 0;
                    }
                    long long d = into_battle(id, m, turn, ix, iy);
                    srand(time(NULL));
                    int m_mp = 0;
                    do {
                        m_mp = rand() % 4 + 1;
                    } while (m_mp <= 1);
                    memset(q, 0, sizeof(q));
                    sprintf(q,"UPDATE gwangju_sword_master.user_state SET mp = mp - %d WHERE id = '%s'", m_mp, id);
                    gotoxy(x, y);
                    printf(" ");
                    if (mysql_query(&db, q)) {
						db_query_error(&db);
                        exit(1);
					}
                    mysql_close(&db);
                    return d;
                }
                else if (x == 52) {
                    MYSQL db;
                    mysql_init(&db);
                    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
                        db_connect_error(&db);
                        return;
                    }
                    char q[255];
                    memset(q, 0, sizeof(q));
                    sprintf(q, "SELECT mp FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
                    if (mysql_query(&db, q)) {
                        db_query_error(&db);
                        mysql_close(&db);
                        exit(1);
                    }
                    MYSQL_RES* res = mysql_store_result(&db);
                    MYSQL_ROW row = mysql_fetch_row(res);
                    if (row == NULL) {
                        db_result_value_error();
                        mysql_free_result(res);
                        mysql_close(&db);
                        exit(1);
                    }
                    int now_mp = atoi(row[0]);
                    if (now_mp <= 10) {
                        memset(string, 0, sizeof(string));
                        if (now_mp <= 3) {
                            strcpy(string, "마나가 부족합니다!");
                            return 0;
                        }
                        else {
                            strcpy(string, "포션을 던지기엔 마나가 부족합니다!");
                        }
                        scrollUpImproved(ix, 2, iy);
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), RED);
                        printAt(ix, iy, string);
                        gotoxy(ix + strlen(string), iy);
                        mysql_free_result(res);
                        mysql_close(&db);
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
                        continue;
                    }
                    char effect = RandomPotionThrow(id, m, turn, ix, iy);
                    unsigned int m_mp = 0;
                    memset(q, 0, sizeof(q));
                    do {
                        m_mp = rand() % 10 + 6;
                    } while (m_mp < 10);
                    sprintf(q, "UPDATE gwangju_sword_master.user_state SET mp = mp - %d WHERE id = '%s'", m_mp, id);
                    if (mysql_query(&db, q)) {
						db_query_error(&db);
						mysql_close(&db);
                        sleep(400);
						exit(1);
					}
                    mysql_close(&db);
                    gotoxy(x, y);
                    printf(" ");
                    srand(time(NULL));
                    int damage;
                    if (effect == 'A') {
                        damage = rand() % 150 + 1;
                        while (damage <= 100) {
                            damage = rand() % 150 + 1;
                        }
                        memset(string, 0, sizeof(string));
                        sprintf(string, "%d의 피해를 입혔다!", damage);
                        scrollUpImproved(ix, 2, iy);
                        printAt(ix, iy, string);
                        gotoxy(ix + strlen(string), iy);
                    }
                    else if (effect == 'B') {
                        damage = rand() % 15 + 1;
                        while (damage <= 5) {
                            damage = rand() % 15 + 1;
                        }
                        memset(string, 0, sizeof(string));
                        sprintf(string, "%d의 피해를 입혔다!", damage);
                        scrollUpImproved(ix, 2, iy);
                        printAt(ix, iy, string);
                        gotoxy(ix + strlen(string), iy);
                    }
                    else if (effect == 'C') {
                        damage = 0;
                    }
                    else if (effect == 'D') {
                        damage = (rand() % 15) - 16;
                        while (damage >= 0) {
                            damage = (rand() % 15) - 16;
                        }
                        memset(string, 0, sizeof(string));
                        setRGBColor(255, 0, 0);
                        int damage_for_print = abs(damage);
                        sprintf(string, "적이 %d의 체력을 회복했다...", damage_for_print);
                        scrollUpImproved(ix, 2, iy);
                        printAt(ix, iy, string);
                        gotoxy(ix + strlen(string), iy);
                        resetColor();
                    }
                    else {
                        damage = 0;
                    }
                    return damage;
                }
                else if (x == 75) {
                    MYSQL db;
                    mysql_init(&db);
                    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
                        db_connect_error(&db);
                        return;
                    }
                    char q[255];
                    memset(q, 0, sizeof(q));
                    sprintf(q, "SELECT mp FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
                    if (mysql_query(&db, q)) {
                        db_query_error(&db);
                        mysql_close(&db);
                        exit(1);
                    }
                    MYSQL_RES* res = mysql_store_result(&db);
                    MYSQL_ROW row = mysql_fetch_row(res);
                    if (row == NULL) {
                        db_result_value_error();
                        mysql_free_result(res);
                        mysql_close(&db);
                        exit(1);
                    }
                    int now_mp = atoi(row[0]);
                    if (now_mp <= 10) {
                        memset(string, 0, sizeof(string));
                        if (now_mp <= 3) {
                            strcpy(string, "마나가 부족합니다!");
                            return 0;
                        }
                        else {
                            strcpy(string, "포션을 마시기엔 마나가 부족합니다!");
                        }
                        strcpy(string, "마나가 부족합니다!");
                        scrollUpImproved(ix, 2, iy);
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), RED);
                        printAt(ix, iy, string);
                        gotoxy(ix + strlen(string), iy);
                        mysql_free_result(res);
                        mysql_close(&db);
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
                        continue;
                    }
                    unsigned int m_mp = 0;
                    memset(q, 0, sizeof(q));
                    do {
                        m_mp = rand() % 10 + 6;
                    } while (m_mp < 10);
                    sprintf(q, "UPDATE gwangju_sword_master.user_state SET mp = mp - %d WHERE id = '%s'", m_mp, id);
                    if (mysql_query(&db, q)) {
                        db_query_error(&db);
                        mysql_close(&db);
                        sleep(400);
                        exit(1);
                    }
                    mysql_close(&db);
                    gotoxy(x, y);
                    printf(" ");
                    char effect = RandomPotionDrink(id, m, turn, ix, iy);
                    srand(time(NULL));
                    long long damage = -124;
                    if (effect == 'D') {
                        Slow(id);
                    }
                    else if (effect == 'A') {
                        Powerup(id);
                    }
                    else if (effect == 'B') {
                        unsigned char hehe = 0;
                        MYSQL db;
                        mysql_init(&db);
                        if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
                            db_connect_error(&db);
                            return;
                        }
                        char q[255];
                        sprintf(q, "UPDATE gwangju_sword_master.user_state SET levelup_point = levelup_point+1 WHERE id = '%s'", id);
                        if (mysql_query(&db, q)) {
                            db_query_error(&db);
                            return;
                        }
                        mysql_close(&db);
                    }
                    else if (effect == 'S') {
                        MYSQL db;
                        mysql_init(&db);
                        if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
                            db_connect_error(&db);
                            return;
                        }
                        char q[255];
                        sprintf(q, "UPDATE gwangju_sword_master.user_state SET max_hp = max_hp+10 WHERE id = '%s'", id);
                        if (mysql_query(&db, q)) {
                            db_query_error(&db);
                            return;
                        }
                        memset(q, 0, sizeof(q));
                        srand(time(NULL));
                        int hp_recovery = rand() % 5 + 1;
                        sprintf(q, "UPDATE gwangju_sword_master.user_state SET hp = hp+%d WHERE id = '%s'", hp_recovery, id);
                        if (mysql_query(&db, q)) {
                            db_query_error(&db);
                            return;
                        }
                        mysql_close(&db);
                    }
                    else if (effect == 'E') {
                        MYSQL db;
                        mysql_init(&db);
                        if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
                            db_connect_error(&db);
                            return;
                        }
                        char q[255];
                        sprintf(q, "UPDATE gwangju_sword_master.account SET mop_num=1 WHERE id = '%s'", id);
                        if (mysql_query(&db, q)) {
                            db_query_error(&db);
                            return;
                        }
                        mysql_close(&db);
                        damage = 1023914;
                    }
                    else if (effect == 'Z') {
                        MYSQL db;
                        if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
                            db_connect_error(&db);
                            return;
                        }
                        char q[255];
                        sprintf(q, "UPDATE gwangju_sword_master.user_state SET hp=1 WHERE id = '%s'", id);
                        if (mysql_query(&db, q)) {
                            db_query_error(&db);
                            return;
                        }
                        mysql_close(&db);
                        clearLine(50, 21);
                        gotoxy(50, 21);
                        for (int i = 0; i < 40; i++) {
                            printf(" ");
                        }
                        damage = 2;
                    }
                    else if (effect == 'G') {
                        damage = abs(damage);
                        damage = -124;
                        
                    }
                    else {
                        setRGBColor(255, 0, 0);
                        printf("Potion Select Error");
                        resetColor;
                        exit(1);
                    }
                    if (damage == -124) {
                        return 0;
                    }
                    else if (damage == 1023914) {
                        return 1023914;
                    }
                    else {
                        return damage;
                    }
                }
                else if (x == 100) {
                    int compare_num = rand() % 100;
                    Runaway(id, m, turn, ix, iy);
                    if (compare_num < 30) {
                        Fugitive(id);
                        memset(string, 0, sizeof(string));
                        strcpy(string, "도망치는 것은 겁쟁이라는 것을 증명하는 것이다...[도망자(2턴):공격력 -10%]");
                        scrollUpImproved(ix, 2, iy);
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), RED);
                        printAt(ix, iy, string);
                        gotoxy(ix + strlen(string), iy);
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
                        Fugitive(id);
                        return;
                    }
                    else {
                        memset(string, 0, sizeof(string));
                        strcpy(string, "도망치는데 성공했다!");
                        scrollUpImproved(ix, 2, iy);
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), GREEN);
                        printAt(ix, iy, string);
                        gotoxy(ix + strlen(string), iy);
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
                        return 1831;
                    }
                }
            }
            case ESC: {
                gotoxy(x, y);
                printf(" ");
                for (int i = 11; i <= 18; i++) {
                    gotoxy(93, i);
                    printf("■");
                }
                for (int i = 93; i < 119; i++) {
                    gotoxy(i, 11);
                    printf("■");
                }
                gotoxy(95, 13);
                printf("> 게임 저장하기");
                gotoxy(97, 15);
                printf("메인화면으로 돌아가기");
                gotoxy(97, 17);
                printf("게임 종료하기");
                int sub_x = 95, sub_y = 13;
                while (true) {
                    n = KeyControl();
                    switch (n) {
                    case UP: {
                        gotoxy(sub_x, sub_y);
                        printf(" ");
                        if (sub_y == 13) {
                            sub_y = 17;
                        }
                        else if (sub_y == 15) {
                            sub_y = 13;
                        }
                        else {
                            sub_y = 15;
                        }
                        gotoxy(sub_x, sub_y);
                        printf(">");
                        break;
                    }
                    case DOWN: {
                        gotoxy(sub_x, sub_y);
                        printf(" ");
                        if (sub_y == 13) {
                            sub_y = 15;
                        }
                        else if (sub_y == 15) {
                            sub_y = 17;
                        }
                        else {
                            sub_y = 13;
                        }
                        gotoxy(sub_x, sub_y);
                        printf(">");
                        break;
                    }
                    case ESC: {
                        for (int i = 11; i <= 18; i++) {
                            gotoxy(93, i);
                            for (int j = 93; j < 119; j++) {
                                printf(" ");
                            }
                        }
                        x = 37;
                        y = 23;
                        gotoxy(x, y);
                        printf(">");
                        goto exit_submenu;
                    }
                    case SUBMIT: {
                        if (sub_y == 13) {
                            char q[255] = { 0, };
                            setRGBColor(255, 255, 153);
                            memset(string, 0, sizeof(string));
                            strcpy(string, "현재 진행상황을 저장했습니다");
                            for (int i = 11; i <= 18; i++) {
                                gotoxy(93, i);
                                for (int j = 93; j < 119; j++) {
                                    printf(" ");
                                }
                            }
                            scrollUpImproved(ix, 2, iy);
                            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), RED);
                            printAt(ix, iy, string);
                            gotoxy(ix + strlen(string), iy);
                            resetColor();
                            goto exit_submenu;
                        }
                        else if (sub_y == 15) {
                            system("cls");
                            Gamemenu(id);
                        }
                        else if (sub_y == 17) {
                            exit(1);    
                        }
                        break;
                    }
                    default: {
                        break;
                    }
                    }
                }
                exit_submenu:
                break;
            }
            case CONSOLE: {
                Input_Cheat(m, id);
                ClearViewState();
                CursorView(0);
                now_level(id);
                now_state(id);
                hp_mp_bar(id);
			}
            default: {
                break;
            }
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
    while (compare_num <= 0) {
        compare_num = rand() % 100;
    }
    if(compare_num < crit) {
        return 1;
    }
    else {
        return 0;
    }
}

long long mop_turn(char id[], Monster m[], unsigned short stage_turn, int x, int y) {
    long long damage = 0;
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
        db_connect_error(&db);
        return 1;
    }
    char q[255];
    sprintf(q, "SELECT hp,defense FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
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
    int defense = atoi(row[1]);
    if (!strcmp("고블린", m[stage_turn].name)) {
        damage = goblin_skill_1(id, m, stage_turn, x, y);
    }
    else if (!strcmp("슬라임", m[stage_turn].name)) {
        slime_skill_1();
        return 0;
    }
    else if (strcmp("박쥐", m[stage_turn].name) == 0) {
        srand(time(NULL));
        int random1 = rand() % 4;
        int random2 = rand() % 10;
        if (random1 >= random2) {
            damage = bat_skill_1(id, m, stage_turn, x, y);
            if (damage == 5) {
                return 1;
            }
        }
        else {
            damage = bat_skill_2(id, m, stage_turn, x, y);
        }
    }
    else if (strcmp("오크", m[stage_turn].name) == 0) {
        oak_skill_1(id, m, stage_turn, x, y);
    }
    else if (strcmp("늑대인간", m[stage_turn].name) == 0) {
        int compare_num = rand() % 10;
        int compare_num2 = rand() % 3;
        if (compare_num >= compare_num2) {
            damage = wolfman_skill_1(id, m, stage_turn, x, y);
        }
        else {
            damage = wolfman_skill_2(id, m, stage_turn, x, y);
        }

    }
    else if (strcmp("흑마'술'사", m[stage_turn].name) == 0) {
        magician_skill_1(id, m, stage_turn, x, y);
        memset(string, 0, sizeof(string));
        strcat(string, "정말 신기하다!");
        scrollUpImproved(32, 3, 17);
        setRGBColor(255, 20, 147);
        printAt(32, 17, string);
        gotoxy(32 + strlen(string), 17);
        resetColor();
    }
    else if(strcmp("드래곤",m[stage_turn].name) == 0) {
        dragon_skill_1(id, m, stage_turn, x, y);
    }
    else if (strcmp("골렘", m[stage_turn].name) == 0) {
		damage = Golem_skill_1(id, m, stage_turn, x, y);
	}
    else if (strcmp("그란디스", m[stage_turn].name) == 0) {
        damage = Grandis_skill_1(id, m, stage_turn, x, y);
        if (damage == 5) {
            return 1;
        }
    }
	else {
		damage = 0;
	}
    if (!(damage == -9999)) {
        int damage_temp = m[stage_turn].attack - defense + damage;
        if (damage_temp <= 0) {
            damage_temp = 1;
        }
        hp -= damage_temp;
    }
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
        Gameover(id);
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
        drop_exp = rand() % 40 + 1;
        while (drop_exp <= 20) {
            drop_exp = rand() % 40 + 1;
        }
    }
    else if (!strcmp("슬라임", name)) {
        drop_exp = rand() % 15 + 1;
        while (drop_exp <= 8) {
            drop_exp = rand() % 15 + 1;
        }
    }
    else if (!strcmp("박쥐", name)) {
        drop_exp = rand() % 55 + 1;
        while (drop_exp <= 30) {
            drop_exp = rand() % 55 + 1;
        }
    }
    else if (!strcmp("오크", name)) {
        drop_exp = rand() % 130 + 1;
        while (drop_exp <= 70) {
            drop_exp = rand() % 130 + 1;
        }
    }
    else if (!strcmp("늑대인간", name)) {
        drop_exp = rand() % 160 + 1;
        while (drop_exp <= 80) {
            drop_exp = rand() % 160 + 1;
        }
    }
    else if (!strcmp("흑마술사", name)) {
        drop_exp = rand() % 90 + 1;
        while (drop_exp <= 50) {
            drop_exp = rand() % 90 + 1;
        }
    }
    else if (!strcmp("드래곤", name)) {
        drop_exp = rand() % 400 + 1;
        while (drop_exp <= 300) {
            drop_exp = rand() % 400 + 1;
        }
    }
    else {
        drop_exp = 0;
    }
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
        db_connect_error(&db);
        exit(1);
    }
    char q[255];
    sprintf(q, "UPDATE gwangju_sword_master.user_state SET levelup_point = levelup_point + '%d' WHERE id = '%s'", drop_exp, id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
        mysql_close(&db);
        exit(1);
    }
    memset(q, 0, sizeof(q));
    sprintf(q, "SELECT levelup_point, levelup_requirement FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
        mysql_close(&db);
        exit(1);
    }
    MYSQL_RES* res = mysql_store_result(&db);
    MYSQL_ROW row = mysql_fetch_row(res);
    if (row == NULL) {
        db_result_value_error();
        mysql_free_result(res);
        mysql_close(&db);
        exit(1);
    }
    int levelup_point = atoi(row[0]);
    int levelup_requirement = atoi(row[1]);
    memset(q, 0, sizeof(q));
    mysql_free_result(res);
    if (levelup_point >= levelup_requirement) {
        sprintf(q, "UPDATE gwangju_sword_master.user_state SET levelup_point = levelup_point - levelup_requirement, levelup_requirement = levelup_requirement + 150, level = level + 1 WHERE id = '%s'", id);
        if (mysql_query(&db, q)) {
            db_query_error(&db);
            mysql_close(&db);
            exit(1);
        }
        memset(q, 0, sizeof(q));
        sprintf(q,"UPDATE gwangju_sword_master.user_state SET max_hp = max_hp + 25, hp = hp + 25, attack = attack + 8, defense = defense + 2, speed = speed + 2, cri_chance = cri_chance + 3, mp = mp + 5 WHERE id = '%s'", id);
        if (mysql_query(&db, q)) {
			db_query_error(&db);
			mysql_close(&db);
			exit(1);
		}
    }
    mysql_close(&db);
}

int Avoidance(char id[], Monster m[], unsigned short stage_turn, int x, int y) {
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
        db_connect_error(&db);
        return;
    }
    char q[255];
    sprintf(q, "SELECT speed FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
        return;
    }
    MYSQL_RES* res = mysql_store_result(&db);
    MYSQL_ROW row = mysql_fetch_row(res);
    if (row == NULL) {
        db_result_value_error();
        return;
    }
    int speed = atoi(row[0]);
    memset(q, 0, sizeof(q));
    int compare_num = rand() % 100;
    if (speed > compare_num) {
        memset(string, 0, sizeof(string));
        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), GREEN);
        strcpy(string, "적의 공격을 회피했다!");
        scrollUpImproved(x, 2, y);
        printAt(x, y, string);
        gotoxy(x + strlen(string), y);
        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
        return 0;
    }
    mysql_free_result(res);
    mysql_close(&db);
    return 1;
}

char RandomPotionDrink(char id[], Monster m[], unsigned short stage_turn, int x, int y) {
    srand(time(NULL));
    memset(string, 0, sizeof(string));
    strcpy(string, "가방에서 마실 포션을 찾고 있다... /");
    scrollUpImproved(x, 2, y);
    printAt(x, y, string);
    gotoxy(x + strlen(string), y);
    short random = rand() % 5;
    for (int i = 0; i < 5 + random; i++) {
        if (i == 0 || i == 6) {
            gotoxy(66, 17);
            printf("―");
        }
        else if (i == 1 || i == 7) {
            gotoxy(66, 17);
            printf("\\");
        }
        else if (i == 2 || i == 8) {
            gotoxy(66, 17);
            printf("|");
        }
        else if (i == 3 || i == 9) {
            gotoxy(66, 17);
            printf("/");
        }
        else if (i == 4) {
            gotoxy(66, 17);
            printf("―");
        }
        else {
            gotoxy(66, 17);
            printf("/");
        }
        unsigned char* check = (unsigned char*)malloc(sizeof(unsigned char));
        if (check == NULL) {
            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), RED);
            fprintf(stderr, "Memory allocation failed\n");
            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
            exit(1);
        }
        *check = (unsigned char)false;
        if (i == 5 + random - 1) {
            *check = (unsigned char)true;
        }
        if (!(*check)) {
            Sleep(150);
        }
        else {
            free(check);
        }
    }
    gotoxy(66, 17);
    printf(" ");
    srand(time(NULL));
    int compare_num = rand() % 100;
    int slow_potion = rand() % 40;
    if (compare_num < slow_potion) {
        memset(string, 0, sizeof(string));
        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), RED);
        strcpy(string, "포션을 마시고 몸이 느려진것 같다...[구속의 포션(2턴):회피률이 1%로 고정된다]");
        scrollUpImproved(x, 2, y);
        printAt(x, y, string);
        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
        gotoxy(x + strlen(string), y);
        return 'D';
    }
    else {
        compare_num = rand() % 100;
        int nice_potion = rand() % 35;
        if (compare_num < nice_potion) {
            memset(string, 0, sizeof(string));
            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), GREEN);
            strcpy(string, "몸속 근육이 펌핑되는게 느껴진다![힘의 포션(2턴):공격력 +10%]");
            scrollUpImproved(x, 2, y);
            printAt(x, y, string);
            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
            gotoxy(x + strlen(string), y);
            return 'A';
        }
        else {
            compare_num = rand() % 100;
            int notbed_potion = rand() % 20;
            short compare_num2 = rand() % 2 + 1;
            if (compare_num < notbed_potion) {
                memset(string, 0, sizeof(string));
                SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), GREEN);
                if (compare_num2 == 1) {
                    strcpy(string, "포션이 H2O로 이뤄졌다!");
                }
                else {
                    strcpy(string, "사과맛 포션이였다!기분이 좋아졌다");
                }
                scrollUpImproved(x, 2, y);
                printAt(x, y, string);
                SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
                gotoxy(x + strlen(string), y);
                return 'B';
            }
            else {
                compare_num = rand() % 100;
                int ultar_potion = rand() % 3;
                if (compare_num < ultar_potion) {
                    memset(string, 0, sizeof(string));
                    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), GREEN);
                    strcpy(string, "포션을 마심과 동시에 몸에 활력이 돈다!:[HP최대치가 영구적으로 10증가한다]");
                    scrollUpImproved(x, 2, y);
                    printAt(x, y, string);
                    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
                    gotoxy(x + strlen(string), y);
                    return 'S';
                }
                else {
                    compare_num = rand() % 100;
                    int bed_potion = rand() % 50;
                    if (compare_num < bed_potion) {
                        memset(string, 0, sizeof(string));
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), RED);
                        strcpy(string, "어지럼증이 생겨 길을 잃었다...:[스테이지의 처음으로 돌아갑니다]");
                        scrollUpImproved(x, 2, y);
                        printAt(x, y, string);
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
                        gotoxy(x + strlen(string), y);
                        scrollUpImproved(x, 2, y);
                        gotoxy(x + strlen(string), y);
                        return 'E';
                    }
                    int die_potion = 2;
                    compare_num == rand() % 100;
                    if (compare_num < bed_potion) {
                        memset(string, 0, sizeof(string));
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), RED);
                        strcpy(string, "포션을 마셨더니 앞이 흐려진다...");
                        scrollUpImproved(x, 2, y);
                        printAt(x, y, string);
                        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
                        gotoxy(x + strlen(string), y);
                        return 'Z';
                    }
                    else {
                        MYSQL db;
                        mysql_init(&db);
                        if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
                            db_connect_error(&db);
                            return;
                        }
                        char q[255];
                        sprintf(q, "SELECT gender FROM gwangju_sword_master.account WHERE id = '%s'", id);
                        if (mysql_query(&db, q)) {
                            db_query_error(&db);
                            return;
                        }
                        MYSQL_RES* res = mysql_store_result(&db);
                        if (res == NULL) {
                            db_query_error(&db);
                            exit(1);
                        }
                        MYSQL_ROW row = mysql_fetch_row(res);
                        if (row == NULL) {
                            db_result_value_error();
                            exit(1);
                        }
                        if (strcmp(row[0], "female") == 0) {
                            memset(string, 0, sizeof(string));
                            setRGBColor(255, 20, 147);
                            strcpy(string, "XY염색체를 가지게 되었다:[캐릭터의 현재 성별이 변경되었다!]");
                            scrollUpImproved(x, 2, y);
                            printAt(x, y, string);
                            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
                            gotoxy(x + strlen(string), y);
                            memset(q, 0, sizeof(q));
                            resetColor();
                            sprintf(q, "UPDATE gwangju_sword_master.account SET gender = 'male' WHERE id = '%s'", id);
                            if (mysql_query(&db, q)) {
                                fprintf(stderr, "Update Query Error: %s\n", mysql_error(&db));
                            }
                        }
                        else if (strcmp(row[0], "male") == 0) {
                            memset(string, 0, sizeof(string));
                            setRGBColor(255, 20, 147);
                            strcpy(string, "XX염색체를 가지게 되었다:[캐릭터의 현재 성별이]");
                            scrollUpImproved(x, 2, y);
                            printAt(x, y, string);
                            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
                            gotoxy(x + strlen(string), y);
                            memset(q, 0, sizeof(q));
                            resetColor();
                            sprintf(q, "UPDATE gwangju_sword_master.account SET gender = 'female' WHERE id = '%s'", id);
                            if (mysql_query(&db, q)) {
                                fprintf(stderr, "Update Query Error: %s\n", mysql_error(&db));
                            }
                        }
                        mysql_close(&db);
                        return 'G';
                    }
                }
            }
        }
    }
    return 'O';
}

char RandomPotionThrow(char id[], Monster m[], unsigned short stage_turn, int x, int y) {
    srand(time(NULL));
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
        db_connect_error(&db);
        return;
    }
    memset(string, 0, sizeof(string));
    strcpy(string, "가방에서 던질 포션을 찾고 있다... /");
    scrollUpImproved(x, 2, y);
    printAt(x, y, string);
    gotoxy(x + strlen(string), y);
    short random = rand() % 5;
    for (int i = 0; i < 5 + random; i++) {
        if (i == 0 || i == 6) {
            gotoxy(66, 17);
            printf("―");
        }
        else if (i == 1 || i == 7) {
            gotoxy(66, 17);
            printf("\\");
        }
        else if (i == 2 || i == 8) {
            gotoxy(66, 17);
            printf("|");
        }
        else if (i == 3 || i == 9) {
            gotoxy(66, 17);
            printf("/");
        }
        else if (i == 4) {
            gotoxy(66, 17);
            printf("―");
        }
        else {
            gotoxy(66, 17);
            printf("/");
        }
        unsigned char* check = (unsigned char*)malloc(sizeof(unsigned char));
        if (check == NULL) {
            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), RED);
            fprintf(stderr, "Memory allocation failed\n");
            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
            exit(1);
        }
        *check = (unsigned char)false;
        if (i == 5 + random - 1) {
            *check = (unsigned char)true;
        }
        if (!(*check)) {
            Sleep(150);
        }
        else {
            free(check);
        }
    }
    gotoxy(66, 17);
    printf(" ");
    srand(time(NULL));
    int compare_num = rand() % 100;
    int nice_potion = rand() % 55;
    if (nice_potion < compare_num) {
        compare_num = rand() % 100;
        int not_bed_potion = rand() % 40;
        if (not_bed_potion < compare_num) {
            compare_num = rand() % 100;
            int bed_potion = rand() % 35;
            if (bed_potion > compare_num) {
                memset(string, 0, sizeof(string));
                SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), RED);
                strcpy(string, "포션을 맞은 적이 체력을 회복하였다!!!");
                scrollUpImproved(x, 2, y);
                printAt(x, y, string);
                SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
                gotoxy(x + strlen(string), y);
                return 'D';
            }
            else {
                memset(string, 0, sizeof(string));
                strcpy(string, "포션을 맞췄지만 아무런 효과가 없다...");
                scrollUpImproved(x, 2, y);
                printAt(x, y, string);
                gotoxy(x + strlen(string), y);
                return 'C';
            }
        }
        else {
            memset(string, 0, sizeof(string));
			strcpy(string, "포션을 맞은 적이 경미한 피해를 입었다!");
			scrollUpImproved(x, 2, y);
			printAt(x, y, string);
			gotoxy(x + strlen(string), y);
			return 'B';
        }
    }
	else {
		memset(string, 0, sizeof(string));
		strcpy(string, "포션을 맞은 적이 큰 피해를 입었다!");
		scrollUpImproved(x, 2, y);
		printAt(x, y, string);
		gotoxy(x + strlen(string), y);
		return 'A';
	}
    return 'E';
}

void Runaway(char id[], Monster m[], unsigned short stage_turn, int x, int y) {
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
        db_connect_error(&db);
        return;
    }
    char q[255];
    sprintf(q, "UPDATE gwangju_sword_master.account SET mop_num = mop_num+1 WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
		db_query_error(&db);
		return;
	}
    return;
}

void Effect_Counter(char id[]) {
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
        db_connect_error(&db);
        return;
    }
    char query[255];
    sprintf(query, "SELECT number FROM gwangju_sword_master.effect WHERE id = '%s'", id);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        return;
    }
    MYSQL_RES* res = mysql_store_result(&db);
    if (res == NULL) {
        db_query_error(&db);
        return;
    }
    MYSQL_ROW row;
    int effect_num[255] = { 0, };
    int index = 0;
    while ((row = mysql_fetch_row(res))) {
        effect_num[index++] = atoi(row[0]);
    }
    mysql_free_result(res);
    for (int i = 0; i < index; i++) {
        if (effect_num[i] != 0) {
            memset(query, 0, sizeof(query));
            sprintf(query, "UPDATE gwangju_sword_master.effect SET remanet = remanet - 1 WHERE id = '%s' AND number = %d", id, effect_num[i]);
            if (mysql_query(&db, query)) {
                db_query_error(&db);
            }
        }
    }
    mysql_close(&db);
    return;
}

void handle_effect(MYSQL* db, const char* id, const char* effect, const char* filename, const char* column) {
    char query[512];
    FILE* fp = fopen(filename, "r+");
    if (fp == NULL) {
        fprintf(stderr, "File Open Error: %s\n", strerror(errno));
        return;
    }
    if (fseek(fp, 0, SEEK_SET) != 0) {
        fprintf(stderr, "File Seek Error: %s\n", strerror(errno));
        fclose(fp);
        return;
    }
    char buffer[256];
    int value = 0;
    if (fgets(buffer, sizeof(buffer), fp) != NULL) {
        value = atoi(buffer);
    }
    else {
        fprintf(stderr, "File Read Error: %s\n", strerror(errno));
        fclose(fp);
        return;
    }
    fclose(fp);

    if (remove(filename) != 0) {
        fprintf(stderr, "File Remove Error: %s\n", strerror(errno));
        return;
    }
    sprintf(query, "UPDATE gwangju_sword_master.user_state SET %s = %d WHERE id = '%s'", column, value, id);
    if (mysql_query(db, query)) {
        fprintf(stderr, "Update Query Error: %s\n", mysql_error(db));
        return;
    }
    sprintf(query, "DELETE FROM gwangju_sword_master.effect WHERE id = '%s' AND effect = '%s'", id, effect);
    if (mysql_query(db, query)) {
        fprintf(stderr, "Delete Query Error: %s\n", mysql_error(db));
    }
    return;
}

void check_and_delete_expired_effects_fug(const char* id, MYSQL* db) {
    char query[512];
    sprintf(query, "SELECT effect FROM gwangju_sword_master.effect WHERE id = '%s' AND remanet <= 0", id);
    if (mysql_query(db, query)) {
        fprintf(stderr, "Query Error: %s\n", mysql_error(db));
        mysql_close(db);
        return;
    }
    MYSQL_RES* res = mysql_store_result(db);
    if (res == NULL) {
        fprintf(stderr, "Store Result Error: %s\n", mysql_error(db));
        mysql_close(db);
        return;
    }
    if (mysql_num_rows(res) == 0) {
        mysql_free_result(res);
        return;
    }
    MYSQL_ROW row;
    while ((row = mysql_fetch_row(res))) {
        if (row == NULL) {
            fprintf(stderr, "Fetch Row Error: %s\n", mysql_error(db));
            continue;
        }
        if (strcmp(row[0], "fugitive") == 0) {
            handle_effect(db, id, "fugitive", "ack_state.txt", "attack");
        }
        else if (strcmp(row[0], "slow") == 0) {
            handle_effect(db, id, "slow", "speed_state.txt", "speed");
        }
        else if (strcmp(row[0], "powerup") == 0) {
            handle_effect(db, id, "powerup", "ackplus_state.txt", "attack");
        }
    }
    mysql_free_result(res);
}

void Resetcount_Print(char id[]) {
    char* consoleBuffer = NULL;
    COORD consoleSize;
    char** buffer = &consoleBuffer;
    COORD* size = &consoleSize;
    const char* buffers = consoleBuffer;
    COORD sizes = consoleSize;
    HANDLE hConsoles = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_SCREEN_BUFFER_INFO csbi;
    GetConsoleScreenBufferInfo(hConsoles, &csbi);
    *size = csbi.dwSize;
    DWORD bufferSize = csbi.dwSize.X * csbi.dwSize.Y;
    *buffer = (char*)malloc(bufferSize * sizeof(CHAR_INFO));
    CHAR_INFO* chiBuffers = (CHAR_INFO*)(*buffer);
    COORD bufferCoords = { 0, 0 };
    SMALL_RECT readRegion = { 0, 0, csbi.dwSize.X - 1, csbi.dwSize.Y - 1 };
    ReadConsoleOutput(hConsoles, chiBuffers, csbi.dwSize, bufferCoords, &readRegion);
    SetConsoleOutputCP(CP_UTF8);
    SetConsoleCP(CP_UTF8);
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
        db_connect_error(&db);
        exit(1);
    }
    char query[255];
    memset(query, 0, sizeof(query));
    sprintf(query, "SELECT reset_count FROM gwangju_sword_master.account WHERE id = '%s'", id);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        exit(1);
    }
    MYSQL_RES* res = mysql_store_result(&db);
    if (res == NULL) {
        db_query_error(&db);
        exit(1);
    }
    MYSQL_ROW row = mysql_fetch_row(res);
    if (row == NULL) {
        db_result_value_error();
        exit(1);
    }
    int num = atoi(row[0]);
    const char* numbers[16][9] = {
        {
            "   \xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93   ",
        "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
        " \xE2\x96\x93\x20\x20\x20\x20\x20\x20\xE2\x96\x93 ",
        " \xE2\x96\x93\x20\x20\x20\x20\x20\x20\xE2\x96\x93 ",
        " \xE2\x96\x93\x20\x20\x20\x20\x20\x20\xE2\x96\x93 ",
        " \xE2\x96\x93\x20\x20\x20\x20\x20\x20\xE2\x96\x93 ",
        " \xE2\x96\x93\x20\x20\x20\x20\x20\x20\xE2\x96\x93 ",
        "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
        "   \xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93   "
        },
        {
            "     \xE2\x96\x93     ",
            "    \xE2\x96\x93\xE2\x96\x93    ",
            "     \xE2\x96\x93     ",
            "     \xE2\x96\x93     ",
            "     \xE2\x96\x93     ",
            "     \xE2\x96\x93     ",
            "     \xE2\x96\x93     ",
            "     \xE2\x96\x93     ",
            "  \xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  "
        },
        {
            "  \x20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  ",
            " \xE2\x96\x93 ",
            " \xE2\x96\x93  ",
            " \xE2\x96\x93  ",
            "   \x20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93    ",
            "  \xE2\x96\x93  ",
            " \xE2\x96\x93  ",
            " \xE2\x96\x93  ",
            " \x20\x20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  "
        },
        {
            "  \xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  ",
            " \xE2\x96\x93 ",
            " \xE2\x96\x93 ",
            " \xE2\x96\x93   ",
            " \xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93   ",
            " \xE2\x96\x93 ",
            " \xE2\x96\x93 ",
            " \xE2\x96\x93  ",
            "  \xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  "
        },
        {
            "  \xE2\x96\x93  ",
            "  \x20\xE2\x96\x93\xE2\x96\x93  ",
            "  \xE2\x96\x93\x20\xE2\x96\x93  ",
            " \xE2\x96\x93\x20\x20\xE2\x96\x93 ",
            "  \xE2\x96\x93\x20\x20\x20\xE2\x96\x93  ",
            "     \xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  ",
            "     \xE2\x96\x93  ",
            "     \xE2\x96\x93  ",
            "     \xE2\x96\x93  "
        },
        {
            "  \xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  ",
            "  \xE2\x96\x93   ",
            "  \xE2\x96\x93    ",
            "  \xE2\x96\x93    ",
            "  \xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  ",
            "  \xE2\x96\x93   ",
            "  \xE2\x96\x93    ",
            "  \xE2\x96\x93    ",
            "  \xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  "
        },
        {
            "  \20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93    ",
            "  \xE2\x96\x93    ",
            "  \xE2\x96\x93    ",
            "  \x20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
            "  \x20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93 "
        },
        {
            "  \20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93    ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93    ",
            "  \x20\x20\x20\x20\x20\xE2\x96\x93    ",
            "  \x20\xE2\x96\x93  ",
            "  \xE2\x96\x93  ",
            "  \xE2\x96\x93  ",
            "  \xE2\x96\x93  ",
            "  \x20 "
        },
        {
            "  \20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93    ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93    ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93    ",
            "  \x20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
            "  \x20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93 "
        },
        {
            "  \x20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93 ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
            "  \x20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  ",
            "  \xE2\x96\x93   ",
            "  \xE2\x96\x93    ",
            "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93    ",
            "  \20\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93  "
        }
    };
    if (num < 0 || num > 15) {
        printf("Reset Counter Printing Error");
        exit(1);
    }
    int i;
    for (i = 0; i < 9; i++) {
        if (num == 0) {
            gotoxy(8, i + 1);
        }
        else if (num == 1 && i < 8) {
            gotoxy(8, i + 1);
        }
        else if (num == 1 && i == 8) {
            gotoxy(10, 8);
        }
        else if (num == 2) {
            switch (i) {
            case 0:
                gotoxy(8, i + 1);
                break;
            case 1:
                gotoxy(14, i + 1);
                break;
            case 2:
                gotoxy(14, i + 1);
                break;
            case 3:
                gotoxy(14, i + 1);
                break;
            case 4:
                gotoxy(7, i + 1);
                break;
            case 5:
                gotoxy(8, i + 1);
                break;
            case 6:
                gotoxy(9, i + 1);
                break;
            case 7:
                gotoxy(9, i + 1);
                break;
            case 8:
                gotoxy(8, i + 1);
                break;
            }
        }
        else if (num == 3) {
            switch (i) {
            case 0:
                gotoxy(8, i + 1);
                break;
            case 1:
            case 2:
            case 3:
                gotoxy(13, i + 1);
                break;
            case 4:
                gotoxy(9, i + 1);
                break;
            case 5:
            case 6:
            case 7:
                gotoxy(13, i + 1);
                break;
            case 8:
                gotoxy(8, i + 1);
                break;
            }
        }
        else if (num == 4) {
            switch (i) {
            case 0:
                gotoxy(12, i + 1);
                break;
            case 1:
                gotoxy(10, i + 1);
                break;
            case 2:
                gotoxy(10, i + 1);
                break;
            case 3:
                gotoxy(10, i + 1);
                break;
            case 4:
                gotoxy(8, i + 1);
                break;
            case 5:
                gotoxy(4, i + 1);
                break;
            case 6:
                gotoxy(9, i + 1);
                break;
            case 7:
                gotoxy(9, i + 1);
                break;
            case 8:
                gotoxy(9, i + 1);
                break;
            }
        }
        else if (num == 5) {
            switch (i) {
            case 0:
                gotoxy(8, i + 1);
                break;
            case 1:
            case 2:
            case 3:
                gotoxy(7, i + 1);
                break;
            case 4:
                gotoxy(8, i + 1);
                break;
            case 5:
            case 6:
            case 7:
                gotoxy(12, i + 1);
                break;
            case 8:
                gotoxy(8, i + 1);
                break;
            }
        }
        else if (num == 6) {
            switch (i) {
            case 0:
                gotoxy(9, i + 1);
                break;
            case 1:
                gotoxy(8, i + 1);
                break;
            case 2:
            case 3:
                gotoxy(13, i + 1);
                break;
            case 4:
                gotoxy(8, i + 1);
                break;
            case 5:
            case 6:
            case 7:
                gotoxy(8, i + 1);
                break;
            case 8:
                gotoxy(8, i + 1);
                break;
            }
        }

        else if (num == 7) {
            switch (i) {
            case 0:
                gotoxy(9, i + 1);
                break;
            case 1:
            case 2:
            case 3:
                gotoxy(8, i + 1);
                break;
            case 4:
                gotoxy(12, i + 1);
                break;
            case 5:
            case 6:
                gotoxy(13, i + 1);
                break;
            case 7:
            case 8:
                gotoxy(13, i + 1);
                break;

            }
        }
        else if (num == 8) {
            switch (i) {
            case 0:
                gotoxy(9, i + 1);
                break;
            case 1:
            case 2:
            case 3:
                gotoxy(8, i + 1);
                break;
            case 4:
                gotoxy(8, i + 1);
                break;
            case 5:
            case 6:
            case 7:
                gotoxy(8, i + 1);
                break;
            case 8:
                gotoxy(8, i + 1);
                break;
            }
        }
        else if (num == 9) {
            switch (i) {
            case 0:
                gotoxy(8, i + 1);
                break;
            case 1:
                gotoxy(8, i + 1);
                break;
            case 2:
            case 3:
                gotoxy(8, i + 1);
                break;
            case 4:
                gotoxy(8, i + 1);
                break;
            case 5:
            case 6:
                gotoxy(13, i + 1);
                break;
            case 7:
                gotoxy(8, i + 1);
                break;
            case 8:
                gotoxy(9, i + 1);
                break;
            }
        }
        printf("%s", numbers[num][i]);
    }
    SetConsoleCP(949);
    SetConsoleOutputCP(949);
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    CHAR_INFO* chiBuffer = (CHAR_INFO*)buffers;
    COORD bufferCoord = { 0, 0 };
    SMALL_RECT writeRegion = { 0, 0, sizes.X - 1, sizes.Y - 1 };
    WriteConsoleOutput(hConsole, chiBuffer, sizes, bufferCoord, &writeRegion);
    free(consoleBuffer);
    return;
}

void Gameover(char id[]) {
    system("cls");
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
        db_connect_error(&db);
        return 1;
    }
    char q[255];
    memset(q, 0, sizeof(q));
    sprintf(q, "UPDATE gwangju_sword_master.account SET stage = 1,mop_num = 1 WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
        Sleep(2000);
        exit(1);
    }
    setRGBColor(204, 0, 51);
    char* over_text = NULL;
    unsigned int line = 0, final_y = 10;
    const char* text =
        " ######      ###    ##     ## ########  #######  ##     ## ######## ########  \n"
        "##    ##    ## ##   ###   ### ##       ##     ## ##     ## ##       ##     ## \n"
        "##         ##   ##  #### #### ##       ##     ## ##     ## ##       ##     ## \n"
        "##   #### ##     ## ## ### ## ######   ##     ## ##     ## ######   ########  \n"
        "##    ##  ######### ##     ## ##       ##     ##  ##   ##  ##       ##   ##   \n"
        "##    ##  ##     ## ##     ## ##       ##     ##   ## ##   ##       ##    ##  \n"
        " ######   ##     ## ##     ## ########  #######     ###    ######## ##     ## \n";

    over_text = (char*)malloc(strlen(text) + 1);
    if (over_text == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(1);
    }
    strcpy(over_text, text);
    if (over_text) {
        int console_width = get_console_width();
        int current_x;
        gotoxy(0, 10);
        for (unsigned int i = 0; i < strlen(over_text); i++) {
            if (over_text[i] == '\n') {
                line++;
                gotoxy(0, 10 + line);
            }
            else {
                if (i == 0 || over_text[i - 1] == '\n') {
                    int line_length = 0;
                    unsigned int j = i;
                    while (j < strlen(over_text) && over_text[j] != '\n') {
                        line_length++;
                        j++;
                    }
                    current_x = (console_width - line_length) / 2;
                    gotoxy(current_x, 10 + line);
                }
                printf("%c", over_text[i]);
            }
            Sleep(1);
        }
        final_y += line;
        free(over_text);
    }
    resetColor();
    gotoxy(45, final_y + 2);
    Sleep(1975);
    system("cls");
    Resetcount_Print(id);
    Sleep(900);
    memset(q, 0, sizeof(q));
    sprintf(q, "UPDATE gwangju_sword_master.account SET reset_count = reset_count+1 WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
        Sleep(2000);
        exit(1);
    }
    memset(q, 0, sizeof(q));
    sprintf(q, "UPDATE gwangju_sword_master.user_state SET max_hp = max_hp + 25 WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
		db_query_error(&db);
		Sleep(2000);
		exit(1);
	}
    memset(q, 0, sizeof(q));
    sprintf(q, "UPDATE gwangju_sword_master.user_state SET hp = max_hp, attack = attack + 8, defense = defense + 2, speed = speed + 2, cri_chance = cri_chance + 3, mp = mp + 5 WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
        Sleep(2000);
        exit(1);
    }
    memset(q, 0, sizeof(q));
    sprintf(q,"UPDATE gwangju_sword_master.user_state SET level=level+1,levelup_requirement=levelup_requirement+150,levelup_point=0 WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
		db_query_error(&db);
		Sleep(2000);
		exit(1);
	}
    memset(q, 0, sizeof(q));
    system("cls");
    Resetcount_Print(id);
    sleep(2600);
    Reline();
    Resetcount_Print(id);
    stage_1(id, 1);
    mysql_close(&db);
    exit(0);
}