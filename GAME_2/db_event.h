#pragma once

#include "mysql.h"

void db_connect_error(MYSQL* conn);
void db_query_error(MYSQL* conn);
void db_result_value_error(void);