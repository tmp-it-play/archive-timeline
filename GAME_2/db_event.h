#pragma once

#ifndef PLAYER_STATE_H
#define PLAYER_STATE_H

#include "mysql.h"

void db_connect_error(MYSQL* conn);
void db_query_error(MYSQL* conn);
void db_result_value_error(void);
void id_find_error(MYSQL* conn, MYSQL_RES** result, MYSQL_ROW row);

#endif // PLAYER_STATE_H