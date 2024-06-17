#include "superclass.h"
#include "db_event.h"

#pragma comment(lib, "libmariadb.lib")

void sign_up(void) {
    char query[255];
    while (true) {
        char id[30], password[30], password_confirm[30];
        MYSQL db_key;
        MYSQL* conn = mysql_init(&db_key);
        ASCII_Art_print();
        if (!mysql_real_connect(conn, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0)) {
            gotoxy(42, 12);
            db_connect_error(conn);
            exit(0);
        }
        system("cls");
        while (true) {
            ASCII_Art_print();
            gotoxy(42, 15);
            printf("Sign up\n");
            gotoxy(40, 16);
            printf("ID:");
            gotoxy(34, 18);
            printf("Password:");
            gotoxy(35, 20);
            printf("Confirm:");
            gotoxy(43, 16);
            CursorView(1);
            scanf_s("%s", id, (unsigned)_countof(id));
            gotoxy(43, 18);
            scanf_s("%s", password, (unsigned)_countof(password));
            gotoxy(43, 20);
            scanf_s("%s", password_confirm, (unsigned)_countof(password_confirm));
            CursorView(0);
            if (strcmp(password, password_confirm) != 0) {
                SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
                system("cls");
                gotoxy(42, 15);
                printf("Sign in\n");
                gotoxy(43, 17);
                printf("비밀번호(Password, Confirm)가 일치하지 않습니다");
                SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
                Sleep(3000);
                system("cls");
                continue;
            }
            sprintf(query, "SELECT id FROM gwangju_sword_master.account WHERE id = '%s'", id);
            if (mysql_query(conn, query)) {
                fprintf(stderr, "Duplicate ID verification failed: %s\n", mysql_error(conn));
                Sleep(3000);
                mysql_close(conn);
                exit(0);
            }
            MYSQL_RES* result = mysql_store_result(conn);
            MYSQL_ROW row = mysql_fetch_row(result);
            if (row && strcmp(row[0], id) == 0) {
                SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
                system("cls");
                gotoxy(42, 15);
                printf("Sign in\n");
                gotoxy(43, 17);
                printf("이미 존재하는 아이디(ID) 입니다");
                SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
                Sleep(3000);
                mysql_free_result(result);
                system("cls");
                continue;
            }
            mysql_free_result(result);
            break;
        }
        memset(query, 0, sizeof(query));
        sprintf(query, "INSERT INTO gwangju_sword_master.account(id, password) VALUES('%s', '%s')", id, password);
        if (mysql_query(conn, query)) {
            db_query_error(conn);
            mysql_close(conn);
            exit(0);
        }
        memset(query, 0, sizeof(query));
        sprintf(query, "INSERT INTO gwangju_sword_master.user_state(id) VALUES('%s')", id);
        if (mysql_query(conn, query)) {
            db_query_error(conn);
            mysql_close(conn);
        }
        system("cls");
        mysql_close(conn);
        sign_in();
    }
}
