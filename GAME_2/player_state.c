#include "superclass.h"
#include "db_event.h"
#include "player_state.h"

static long long now_hp, now_mp;
static int initialized_hp = 0, initialized_mp = 0;

void initial_hp(char id[]) {
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0)) {
        gotoxy(42, 12);
        db_connect_error(&db);
        exit(0);
    }
    char q[255];
    sprintf(q, "SELECT hp FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
        exit(0);
    }
    MYSQL_RES* result = mysql_store_result(&db);
    if (result == NULL) {
        db_query_error(&db);
        exit(0);
    }
    MYSQL_ROW row = mysql_fetch_row(result);
    if (row == NULL) {
        gotoxy(42, 12);
        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
        printf("No data found for the given ID.");
        mysql_free_result(result);
        mysql_close(&db);
        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
        Sleep(3000);
        exit(0);
    }
    long long max_hp = atoll(row[0]);
    if (!initialized_hp) {
        now_hp = max_hp;
        initialized_hp = 1;
    }
    gotoxy(17, 24);
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 10);
    printf("[%lld/%lld]", now_hp, max_hp);
    mysql_free_result(result);
    mysql_close(&db);
    gotoxy(2, 24);
    printf("HP[          ]");
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
    return;
}

void initial_mp(char id[]) {
    MYSQL db;
    mysql_init(&db);
    if (!mysql_real_connect(&db, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0)) {
        gotoxy(42, 12);
        db_connect_error(&db);
        exit(0);
    }
    char q[255];
    sprintf(q, "SELECT mp FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
    if (mysql_query(&db, q)) {
        db_query_error(&db);
        exit(0);
    }
    MYSQL_RES* result = mysql_store_result(&db);
    if (result == NULL) {
        db_query_error(&db);
        exit(0);
    }
    MYSQL_ROW row = mysql_fetch_row(result);
    if (row == NULL) {
        gotoxy(42, 12);
        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
        printf("No data found for the given ID.");
        mysql_free_result(result);
        mysql_close(&db);
        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
        Sleep(3000);
        exit(0);
    }
    long long max_mp = atoll(row[0]);
    if (!initialized_mp) {
        now_mp = max_mp;
        initialized_mp = 1;
    }
    gotoxy(17, 25);
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 1);
    printf("[%lld/%lld]", now_mp, max_mp);
    mysql_free_result(result);
    mysql_close(&db);
    gotoxy(2, 25);
    printf("MP[          ]");
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
    return;
}