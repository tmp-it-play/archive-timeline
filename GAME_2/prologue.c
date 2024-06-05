#include "superclass.h"
#include "superclass.h"
#include "db_event.h"

#pragma comment(lib, "libmariadb.lib")

void new_game_reconfirm(char id[]) {
    system("cls");
    gotoxy(42, 12);
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
    printf("정말 게임을 새로 시작하시겠습니까?");
    gotoxy(39, 13);
    printf("[기존의 세이브파일이 있다면 삭제됩니다]");
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
    int x = 45, y = 15;
    gotoxy(45, 15);
    printf("> 예");
    gotoxy(64, 15);
    printf("아니요");
    while (true) {
        int n = KeyControl();
        switch (n) {
        case RIGHT: {
            gotoxy(x, y);
            printf(" ");
            if (x >= 45 && x < 62) {
                x = 62;
            }
            else {
                x = 45;
            }
            gotoxy(x, y);
            printf(">");
            break;
        }
        case LEFT: {
            gotoxy(x, y);
            printf(" ");
            if (x == 62) {
                x = 45;
            }
            else {
                x = 62;
            }
            gotoxy(x, y);
            printf(">");
            break;
        }
        case SUBMIT: {
            system("cls");
            if (x == 45) {
                gender_select(id);
                return;
            }
            else if (x == 62) {
                Gamemenu(id);
                return;
            }
        }
        default:
            break;
        }
    }

    exit(1);
}

void gender_select(char id[]) {
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0)) {
        gotoxy(42, 12);
        db_connect_error(&db);
        exit(0);
    }
    system("cls");
    gotoxy(45, 12);
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
    printf("주인공의 성별을 정해주세요");
    gotoxy(39, 13);
    printf("[성별에 따라 스토리가 바뀔 수 있습니다]");
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
    int x = 45, y = 15;
    gotoxy(45, 15);
    printf("> 남");
    gotoxy(66, 15);
    printf("여");
    char query[255];
    while (true) {
        int n = KeyControl();
        switch (n) {
        case RIGHT: {
            gotoxy(x, y);
            printf(" ");
            if (x >= 45 && x < 63) {
                x = 64;
            }
            else {
                x = 45;
            }
            gotoxy(x, y);
            printf(">");
            break;
        }
        case LEFT: {
            gotoxy(x, y);
            printf(" ");
            if (x == 64) {
                x = 45;
            }
            else {
                x = 64;
            }
            gotoxy(x, y);
            printf(">");
            break;
        }
        case SUBMIT: {
            system("cls");
            if (x == 45) {
                sprintf(query, "UPDATE gwangju_sword_master.account SET gender = 'male' WHERE id = '%s'", id);
                if (mysql_query(&db, query)) {
                    db_query_error(&db);
                }
                prologue(1, id, &db);
                mysql_close(&db);
                return;
            }
            else if (x == 64) {
                sprintf(query, "UPDATE gwangju_sword_master.account SET gender = 'female' WHERE id = '%s'", id);
                if (mysql_query(&db, query)) {
                    db_query_error(&db);
                }
                prologue(2, id, &db);
                mysql_close(&db);
                return;
            }
        }
        default:
            break;
        }
    }
    mysql_close(&db);
    exit(1);
}

void save_check(char id[]) {
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
        db_connect_error(&db);
        exit(0);
    }
    char q[255];
    sprintf(q, "SELECT save_file FROM gwangju_sword_master.account WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
        exit(0);
    }
    MYSQL_RES* result = mysql_store_result(&db);
    MYSQL_ROW row = mysql_fetch_row(result);
    if (row == 0 || row == '0' || strcmp(row, "false")) {
        gotoxy(45, 15);
        printf("현재 계정에 세이브파일이 없습니다!");
        Sleep(3000);
        system("cls");
        Program_config();
    }
    else if (row == 1 || row == '1' || row == "true") {
        //게임 이어하기 기능 구현
    }
    return;
}

int get_console_width(void) {
    CONSOLE_SCREEN_BUFFER_INFO csbi;
    int width = 0;
    if (GetConsoleScreenBufferInfo(GetStdHandle(STD_OUTPUT_HANDLE), &csbi)) {
        width = csbi.srWindow.Right - csbi.srWindow.Left + 1;
    }
    return width;
}

void prologue(short gender, char id[], MYSQL* conn) {
    char query[255];
    memset(query, 0, sizeof(query));
    sprintf(query, "UPDATE gwangju_sword_master.account SET stage = 0 WHERE id = '%s'", id);
    if (mysql_ping(conn) != 0) {
        if (!mysql_real_connect(conn, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0)) {
            db_connect_error(conn);
            exit(0);
        }
    }
    if (mysql_query(conn, query)) {
        db_query_error(conn);
        exit(0);
    }
    char* prologue_text = NULL;
    unsigned int line = 0, final_y = 10;
    if (gender == 1) {
        const char* text = "당신은 헤네시스왕국의 기사입니다.\n"
            "평화롭던 왕국에 그란디스라는 악마가 찾아와 공주를\n"
            "납치해 갔습니다. 당신은 나라의 부름을 받아 공주를 찾으러 던전에 찾아왔습니다.\n"
            "그 순간 당신에게 엄청난 능력이 생기는데.....";

        prologue_text = (char*)malloc(strlen(text) + 1);
        if (prologue_text == NULL) {
            fprintf(stderr, "Memory allocation failed\n");
            exit(1);
        }
        strcpy(prologue_text, text);
    }
    else if (gender == 2) {
        const char* text = "당신은 헤네시스왕국의 기사입니다.\n"
            "평화롭던 왕국에 그란디스라는 악마가 찾아와 왕자를\n"
            "납치해 갔습니다. 당신은 나라의 부름을 받아 왕자를 찾으러 던전에 찾아왔습니다.\n"
            "그 순간 당신에게 엄청난 능력이 생기는데.....";

        prologue_text = (char*)malloc(strlen(text) + 1);
        if (prologue_text == NULL) {
            fprintf(stderr, "Memory allocation failed\n");
            Sleep(3000);
            exit(1);
        }
        strcpy(prologue_text, text);
    }
    if (prologue_text) {
        int console_width = get_console_width();
        int current_x;
        gotoxy(0, 10);
        for (unsigned int i = 0; i < strlen(prologue_text); i++) {
            if (prologue_text[i] == '\n') {
                line++;
                gotoxy(0, 10 + line);
            }
            else {
                if (i == 0 || prologue_text[i - 1] == '\n') {
                    int line_length = 0;
                    unsigned int j = i;
                    while (j < strlen(prologue_text) && prologue_text[j] != '\n') {
                        line_length++;
                        j++;
                    }
                    current_x = (console_width - line_length) / 2;
                    gotoxy(current_x, 10 + line);
                }
                printf("%c", prologue_text[i]);
            }
            Sleep(50);
        }
        final_y += line;
        free(prologue_text);
    }
    gotoxy(45, final_y + 2);
    Sleep(1975);
    printf("계속하려면 Enter를 누르세요");
    CursorView(0);
    while (true) {
        int n = KeyControl();
        if (n == SUBMIT) {
            system("cls");
            outline(id);
            break;
        }
        else {
            continue;
        }
    }
    system("cls");
}