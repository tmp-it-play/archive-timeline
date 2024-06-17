#pragma once

#include "mysql.h"

void connect_to_db(MYSQL* db);
void db_connect_error(MYSQL* conn);
void db_query_error(MYSQL* conn);
void db_result_value_error(void);
void id_find_error(MYSQL* conn, MYSQL_RES** result, MYSQL_ROW row);