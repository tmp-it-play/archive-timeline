#include "superclass.h"

void stage_2(char id[], int mop_num) {
    bool mana_recovery = false;
    Clear_Gamelog();
    static int initial_x = 32, initial_y = 17, mop_hp, mop_max_hp;
    int n = 20;
    label:;
    Monster m[15] = { goblin(), bat(), bat(), oak(), goblin() };
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
    sprintf(query, "UPDATE gwangju_sword_master.account SET stage = 2, mop_num = %d WHERE id = '%s'", mop_num, id);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        mysql_close(&db);
        exit(0);
    }
    for (int i = mop_num - 1; i < n; i++) {
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
        printf("                                           ");
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
                    if (mop_num == 3) {
                        Clear_Gamelog();
                        gotoxy(50, 21);
                        printf("                                           ");
                        Whisper(id);
                    }
                    mop_num++;
                    break;
                }
            }
        }
        check_and_delete_expired_effects_fug(id, &db);
        Effect_Counter(id);
    }
    mysql_close(&db);
}

int has_final_consonant(wchar_t last_char) {
    if (last_char >= 0xAC00 && last_char <= 0xD7A3) {
        int relative_code = last_char - 0xAC00;
        int final_consonant = relative_code % 28;
        return final_consonant != 0;
    }
    return 0;
}

void add_subject_marker(const wchar_t* word, wchar_t* result) {
    wchar_t last_char = word[wcslen(word) - 1];
    if (has_final_consonant(last_char)) {
        swprintf(result, 100, L"%ls%ls", word, L"이");
    }
    else {
        swprintf(result, 100, L"%ls%ls", word, L"가");
    }
}