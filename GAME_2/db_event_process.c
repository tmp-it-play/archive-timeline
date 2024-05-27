#include "superclass.h"

#pragma comment (lib,"libmariadb.lib")

void db_connect_error(MYSQL* conn) {
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
	fprintf(stderr, "Database connect falled: %s\n", mysql_error(conn));
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
	Sleep(3000);
}

void db_query_error(MYSQL* conn) {
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
	fprintf(stderr, "Query execution failed: %s\n", mysql_error(conn));
	Sleep(3000);
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
}

void db_result_value_error(void) {
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
	printf("Query result value is not valid");
	Sleep(3000);
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
}

void id_find_error(MYSQL *conn,MYSQL_RES **result,MYSQL_ROW row) {
	if (row == NULL) {
		gotoxy(42, 12);
		SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
		printf("No data found for the given ID.");
		mysql_free_result(result);
		mysql_close(conn);
		SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
		Sleep(3000);
		exit(0);
	}
}