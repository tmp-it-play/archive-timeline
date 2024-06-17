#include "superclass.h"
#include "player_state.h"
#include "mop_dictionary.h"
#include "db_event.h"

static unsigned short turn = 0;

void stage1_clear(char id[]);

void scrollup_motion(int initial_x, int initial_y) {
    scrollUpImproved(initial_x, 2, initial_y);
}

void stage_1(char id[], int mop_num) {
    static int initial_x = 32, initial_y = 17, mop_hp, mop_max_hp;
    int n = 6;
    char string[256];
    Monster m[6] = { goblin(), slime(), slime(), bat(), goblin(), goblin() };
    MYSQL db;
    memset(string, 0, sizeof(string));
    setRGBColor(0, 255, 0);
    strcpy(string, "Stage.1");
    printAt(initial_x, initial_y, string);
    resetColor();
    connect_to_db(&db);
    memset(string, 0, sizeof(string));
    strcpy(string, " ");
    scrollup_motion(initial_x, 17);
    printAt(initial_x, initial_y, string);
    gotoxy(initial_x + strlen(string), initial_y);
    char query[255];
    sprintf(query, "UPDATE gwangju_sword_master.account SET stage = 1, mop_num = %d WHERE id = '%s'", mop_num, id);
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
        sprintf(string, "%s이 튀어나왔다!", m[i].name);
        scrollup_motion(initial_x, 17);
        printAt(initial_x, initial_y, string);
        mop_max_hp = mop_hp = m[i].hp;
        while (true) {
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
                    mop_num++;
                    break;
                }
            }
        }
        check_and_delete_expired_effects_fug(id, &db);
        Effect_Counter(id);
    }
    mysql_close(&db);
    stage1_clear(id);
    stage_2(id, 1);
}

void stage1_clear(char id[]) {
    MYSQL db;
    connect_to_db(&db);
    Clear_Gamelog();
    char query[255];
    unsigned int line = 0;
    unsigned int final_y = 2;
    memset(query, 0, sizeof(query));
    const char* text = "당신은 여정을 시작하고 지도에 표시된 몬스터들이 도사린다는 숲의 입구를 지나자마자\n"
        "몬스터들의 습격을 받았습니다\n"
        "당신은 몬스터들을 모두 처치하고 앞으로 나아갔습니다.\n"
        "얼마 지나지 않아 약초를 발견하게 되었고\n"
        "이를 이용해 전투에서 다친 곳을 치료하고 다시 길을 떠났습니다.\n"
        "앞으로의 여정은 험난할 것입니다...";
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
            Sleep(50);
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
            sprintf(query, "UPDATE gwangju_sword_master.account SET stage = 2, mop_num = 1 WHERE id = '%s'", id);
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