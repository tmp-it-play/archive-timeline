#include "superclass.h"

void stage_2(char id[], int mop_num) {
    bool mana_recovery = false;
    Clear_Gamelog();
    static int initial_x = 32, initial_y = 17, mop_hp, mop_max_hp;
    int n = 10;
    label:;
    Monster m[10] = { goblin(), bat(), bat(), Whisper(), oak(), goblin(), slime(), oak(), goblin(), wolfman() };
    memset(string, 0, sizeof(string));
    setRGBColor(0, 255, 0);
    strcpy(string, "Stage.2");
    printAt(initial_x, initial_y, string);
    resetColor();
    MYSQL db;
    connect_to_db(&db);
    memset(string, 0, sizeof(string));
    strcpy(string, " ");
    scrollup_motion(initial_x, 17);
    printAt(initial_x, initial_y, string);
    gotoxy(initial_x + strlen(string), initial_y);
    char query[255];
    char event_check[30];
    memset(event_check, 0, sizeof(event_check));
    sprintf(query, "UPDATE gwangju_sword_master.account SET stage = 2, mop_num = %d WHERE id = '%s'", mop_num, id);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        mysql_close(&db);
        exit(0);
    }
    for (int i = mop_num - 1; i < n; i++) {
        strcpy(event_check, m[i].type);
        if (strcmp(event_check, "Event") == 0) {
            Whisper(id);
            MYSQL db;
            connect_to_db(&db);
            memset(query, 0, sizeof(query));
            sprintf(query, "UPDATE gwangju_sword_master.account SET mop_num = mop_num + 1 WHERE id = '%s'", id);
            if (mysql_query(&db, query)) {
                db_query_error(&db);
                mysql_close(&db);
                exit(0);
            }
            mysql_close(&db);
            continue;
        }
        else {
            unsigned char match_turn = false;
            if (i > 0) {
                scrollup_motion(initial_x, initial_y);
            }
            memset(string, 0, sizeof(string));
            srand(time(NULL));
            if (strcmp(m[i].name, "고블린") == 0 || strcmp(m[i].name, "슬라임") == 0 || strcmp(m[i].name, "늑대인간") == 0) {
                short sync = rand() % 2 + 1;
                if (sync == 1) {
                    sprintf(string, "%s이 튀어나왔다!", m[i].name);
                }
                else {
                    sprintf(string, "%s이 나타났다!", m[i].name);
                }
            }
            else {
                short sync = rand() % 2 + 1;
                if (sync == 1) {
                    sprintf(string, "%s가 튀어나왔다!", m[i].name);
                }
                else {
                    sprintf(string, "%s가 나타났다!", m[i].name);
                }
            }
            gotoxy(50, 21);
            printf("                                                    ");
            scrollup_motion(initial_x, 17);
            printAt(initial_x, initial_y, string);
            mop_max_hp = mop_hp = m[i].hp;
            while (true) {
                sprintf(query, "SELECT max_mp,mp FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
                if (mysql_query(&db, query)) {
                    db_query_error(&db);
                    mysql_close(&db);
                    exit(1);
                }

                MYSQL_RES* res = mysql_store_result(&db);
                MYSQL_ROW row = mysql_fetch_row(res);
                int mp_max = atoi(row[0]);
                int mp = atoi(row[1]);
                mysql_free_result(res);
                memset(query, 0, sizeof(query));
                int mp_reco = mp + 10 > mp_max ? mp_max - mp : 10;
                if (mana_recovery) {
                    memset(query, 0, sizeof(query));
                    sprintf(query, "UPDATE gwangju_sword_master.user_state SET mp = mp+%d WHERE id = '%s'", mp_reco, id);
                    if (mysql_query(&db, query)) {
                        db_query_error(&db);
                        mysql_close(&db);
                        exit(0);
                    }
                }
                mana_recovery = true;
                if (!mysql_ping(&db)) {
                    connect_to_db(&db);
                }
                gotoxy(50, 21);
                printf("                                           ");
                mop_hp_bar(mop_hp, mop_max_hp, 50, 21, m[i].name);
                ClearViewState();
                now_level(id);
                now_state(id);
                hp_mp_bar(id);
                long long b = ingame_select(id, m, turn, initial_x, initial_y);
                if (b == 1831) {
                    mop_num++;
                    break;
                }
                else if (b == 1023914) {
                    i = -1;
                    mop_num = 1;
                    goto label;
                    continue;
                }
                else {
                    short sync = 0;
                    mop_hp -= b;
                    turn++;
                    match_turn = true;
                    if (mop_hp > 0) {
                        if (match_turn == true) {
                            sync = mop_turn(id, m, i, initial_x, initial_y);
                        }
                        if (sync) {
                            mop_hp += 5;
                            memset(query, 0, sizeof(query));
                            sprintf(query, "UPDATE gwangju_sword_master.user_state SET hp = hp - 5 WHERE id = '%s'", id);
                            if (mysql_query(&db, query)) {
                                db_query_error(&db);
                                mysql_close(&db);
                                exit(0);
                            }
                        }
                        continue;
                    }
                    else if (mop_hp <= 0) {
                        memset(string, 0, sizeof(string));
                        setRGBColor(255, 255, 51);
                        sprintf(string, "%s를 처치했다!", m[i].name);
                        drop_booty(id, m[i].name);
                        scrollup_motion(initial_x, 17);
                        printAt(initial_x, initial_y, string);
                        gotoxy(initial_x + strlen(string), initial_y);
                        resetColor();
                        memset(query, 0, sizeof(query));
                        sprintf(query, "UPDATE gwangju_sword_master.account SET mop_num = mop_num + 1 WHERE id = '%s'", id);
                        if (mysql_query(&db, query)) {
                            db_query_error(&db);
                            mysql_close(&db);
                            exit(0);
                        }
                        event:;
                        if (mop_num == 3) {
                            Clear_Gamelog();
                            gotoxy(50, 21);
                            printf("                                              ");
                            Whisper_conn(id);
                            memset(query, 0, sizeof(query));
                            Clear_Gamelog();
                        }
                        if (mop_num == 6) {
                            Clear_Gamelog();
                            gotoxy(50, 21);
                            printf("                                              ");
                            Health_Club_conn(id);
                            memset(query, 0, sizeof(query));
                            Clear_Gamelog();
                        }
                        if (mop_num == 9) {
                            Clear_Gamelog();
                            gotoxy(50, 21);
                            printf("                                              ");
                            Heavy_Maichgun_conn(id);
                            memset(query, 0, sizeof(query));
                            Clear_Gamelog();
                        }
                        mop_num++;
                        break;
                    }
                }
            }
            check_and_delete_expired_effects_fug(id, &db);
            Effect_Counter(id);
        }
    }
    mysql_close(&db);
    gotoxy(50, 21);
    printf("                                              ");
    stage2_clear(id);
    stage_3(id, 1);
}

void stage2_clear(char id[]) {
    MYSQL db;
    gotoxy(50, 21);
    printf("                                           ");
    connect_to_db(&db);
    Clear_Gamelog();
    char query[255];
    unsigned int line = 0;
    unsigned int final_y = 2;
    bool sync = false;
    memset(query, 0, sizeof(query));
    const char* text = "당신은 의문의 할아버지와 마주친 후 늑대인간과의 혈투에서 승리하고\n"
        "숲을 나왔습니다.\n"
        "그란디스가 있는 곳이 멀지 않았습니다..\n"
        "알 수 없는 힘은 아직 당신을 따라다니며 가면 갈수록 적들은 강력해지고 있습니다.\n"
        "그러나 아직 당신의 사명은 완수되지 않았습니다...\n"
        "앞으로 나아갑시다!";
    int console_width = 120 - 32 + 1;
    int console_height = 17 - 2 + 1;
    int start_x = 32;
    int start_y = 2;
    unsigned int text_length = strlen(text);
    unsigned int i = 0;
    while (i < text_length) {
        int current_x = start_x;
        int current_y = start_y + line;
        int line_length = 0;
        while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
            line_length++;
        }
        current_x = start_x + (console_width - line_length) / 2;
        gotoxy(current_x, current_y);
        for (int j = 0; j < line_length; j++) {
            printf("%c", text[i + j]);
            fflush(stdout);
            if (_kbhit()) {
                int key = KeyControl();
                if (key == Key_S) {
                    sync = true;
                    break;
                }
            }
            if (!sync) {
                Sleep(50);
            }
        }
        if (sync) {
            break;
        }
        i += line_length;
        if (text[i] == '\n') {
            i++;
        }
        line++;
        if (line >= console_height) {
            break;
        }
    }
    if (sync) {
        for (int i = 0; i < 18; i++) {
            for (int j = 0; j < 87; j++) {
                gotoxy(32 + j, 0 + i);
                printf(" ");
            }
        }
        line = 0;
        i = 0;
        while (i < text_length) {
            int current_x = start_x;
            int current_y = start_y + line;
            int line_length = 0;
            while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                line_length++;
            }
            current_x = start_x + (console_width - line_length) / 2;
            gotoxy(current_x, current_y);
            for (int j = 0; j < line_length; j++) {
                printf("%c", text[i + j]);
                fflush(stdout);
            }
            i += line_length;
            if (text[i] == '\n') {
                i++;
            }
            line++;
            if (line >= console_height) {
                break;
            }
        }
    }
    final_y = start_y + line;
    const char* hp_recovered_text = "[HP가 최대치까지 회복되었습니다]";
    int hp_recovered_x = start_x + (console_width - strlen(hp_recovered_text)) / 2;
    gotoxy(hp_recovered_x, final_y + 1);
    setRGBColor(0, 255, 0);
    printf("%s", hp_recovered_text);
    resetColor();
    int message_x = start_x + (console_width - 27) / 2;
    gotoxy(message_x, final_y + 4);
    Sleep(1975);
    printf("계속하려면 Enter를 누르세요");
    CursorView(0);
    while (true) {
        int n = KeyControl();
        if (n == SUBMIT) {
            sprintf(query, "UPDATE gwangju_sword_master.account SET stage = 3, mop_num = 1 WHERE id = '%s'", id);
            if (mysql_query(&db, query)) {
                db_query_error(&db);
                mysql_close(&db);
                exit(0);
            }
            memset(query, 0, sizeof(query));
            sprintf(query, "UPDATE gwangju_sword_master.user_state SET hp = max_hp WHERE id = '%s'", id);
            if (mysql_query(&db, query)) {
                db_query_error(&db);
                mysql_close(&db);
                exit(0);
            }
            mysql_close(&db);
            return;
        }
        else {
            continue;
        }
    }
}