#include "superclass.h"

#pragma comment (lib,"libmariadb.lib")

void db_connect_error(MYSQL* conn) {
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
	fprintf(stderr, "Database connect falled: %s\n", mysql_error(conn));
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
	Sleep(3000);
}