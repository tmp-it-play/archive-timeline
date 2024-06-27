#include "superclass.h"
#include "db_event.h"

#pragma comment (lib,"libmariadb.lib")
#pragma comment(lib, "user32.lib")

void sign_in(void) {
	while (true) {
		MYSQL db_key;
		ASCII_Art_print();
		mysql_init(&db_key);
		gotoxy(42, 15);
		printf("Sign in\n");
		if (!mysql_real_connect(&db_key, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0)) {
			gotoxy(42, 12);
			db_connect_error(&db_key);
			exit(0);
		}
		gotoxy(40, 16);
		printf("ID:");
		gotoxy(34, 18);
		printf("Password:");
		gotoxy(43, 16);
		char id[30], password[30];
		CursorView(1);
		scanf_s(" %[^\n]", id, sizeof(char) * 30);
		gotoxy(43, 18);
		scanf_s(" %[^\n]", password, sizeof(char) * 30);
		char query[255];
		sprintf(query, "SELECT id FROM gwangju_sword_master.account WHERE id = '%s'", id);
		if (mysql_query(&db_key, query)) {
			db_query_error(&db_key);
			exit(0);
		}
		MYSQL_RES* result = mysql_store_result(&db_key);
		MYSQL_ROW row = mysql_fetch_row(result);
		if (row) {
			memset(query, 0, sizeof(query));
			sprintf(query, "SELECT id FROM gwangju_sword_master.account WHERE password = '%s'", password);
			if (mysql_query(&db_key, query)) {
				db_query_error(&db_key);
				exit(0);
			}
			result = mysql_store_result(&db_key);
			row = mysql_fetch_row(result);
			if (row != NULL || row != 0) {
				if (strcmp(row, id)) {
					system("cls");
					mysql_close(&db_key);
					Gamemenu(id);
				}
			}
			else {
				SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
				system("cls");
				gotoxy(42, 15);
				CursorView(0);
				printf("Sing in\n");
				gotoxy(43, 17);
				printf("아이디(ID) 또는 비밀번호(Password)를 다시 확인해주세요");
				SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
				Sleep(3000);
				mysql_close(&db_key);
				system("cls");
			}
			continue;
		}
		else {
			SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
			system("cls");
			gotoxy(42, 15);
			CursorView(0);
			printf("Sing in\n");
			gotoxy(43, 17);
			printf("아이디(ID) 또는 비밀번호(Password)를 다시 확인해주세요");
			SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
			Sleep(3000);
			mysql_close(&db_key);
			system("cls");
		}
		continue;
	}
}
