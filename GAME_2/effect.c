#include "superclass.h"
#include "player_state.h"
#include "mop_dictionary.h"
#include "db_event.h"
#include "color.h"

void Slow_insert(char id[], const char* effect);
void Powerup_insert(char id[], const char* effect);
void Burn_insert(char id[], const char* effect);

void connect_to_db(MYSQL* db) {
    mysql_init(db);
    if (!mysql_real_connect(db, "localhost", "root", "123456", "board", 0, NULL, 0)) {
        fprintf(stderr, "Failed to connect to database: Error: %s\n", mysql_error(db));
        exit(1);
    }
    mysql_set_character_set(db, "utf8mb4");
}

void insert_data(const char* id, const char* effect) {
    char query[512];
    char escaped_effect[255];
    memset(query, 0, sizeof(query));
    memset(escaped_effect, 0, sizeof(escaped_effect));
    MYSQL db;
    connect_to_db(&db);
    sprintf(query, "SELECT effect FROM gwangju_sword_master.effect WHERE id = '%s' AND effect = '%s'", id, effect);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    MYSQL_RES* res = mysql_store_result(&db);
    if (res == NULL) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    MYSQL_ROW row = mysql_fetch_row(res);
    if (row != NULL) {
        sprintf(query, "UPDATE gwangju_sword_master.effect SET remanet = '2' WHERE id = '%s' AND effect = '%s'", id, effect);
        if (mysql_query(&db, query)) {
            db_query_error(&db);
            mysql_free_result(res);
            mysql_close(&db);
            return;
        }
    }
    else {
        mysql_real_escape_string(&db, escaped_effect, effect, strlen(effect));
        sprintf(query, "INSERT INTO gwangju_sword_master.effect(id, effect, remanet) VALUES ('%s', '%s', '2')", id, escaped_effect);
        if (mysql_query(&db, query)) {
            db_query_error(&db);
            mysql_free_result(res);
            mysql_close(&db);
            return;
        }
    }
    mysql_free_result(res);
    memset(query, 0, sizeof(query));
    sprintf(query, "SELECT attack FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    res = mysql_store_result(&db);
    if (res == NULL) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    row = mysql_fetch_row(res);
    if (row == NULL) {
        db_query_error(&db);
        mysql_free_result(res);
        mysql_close(&db);
        return;
    }
    int attack = atoi(row[0]);
    mysql_free_result(res);
    FILE* file = fopen("ack_state.txt", "w");
    memset(query, 0, sizeof(query));
    int attack_decrease = (int)(attack * 0.1);
    fprintf(file, "%d", attack);
    fclose(file);
    sprintf(query, "UPDATE gwangju_sword_master.user_state SET attack = attack - %d WHERE id = '%s'", attack_decrease, id);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    mysql_close(&db);
}

void Fugitive(char id[]) {
    insert_data(id, "fugitive");
    return;
}

void Slow(char id[]) {
    Slow_insert(id, "slow");
    return;
}

void Powerup(char id[]) {
    Powerup_insert(id, "powerup");
    return;
}

void Slow_insert(char id[], const char* effect) {
    char query[512];
    char escaped_effect[255];
    memset(query, 0, sizeof(query));
    memset(escaped_effect, 0, sizeof(escaped_effect));
    MYSQL db;
    connect_to_db(&db);
    sprintf(query, "SELECT effect FROM gwangju_sword_master.effect WHERE id = '%s' AND effect = '%s'", id, effect);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    MYSQL_RES* res = mysql_store_result(&db);
    if (res == NULL) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    MYSQL_ROW row = mysql_fetch_row(res);
    if (row != NULL) {
        sprintf(query, "UPDATE gwangju_sword_master.effect SET remanet = '2' WHERE id = '%s' AND effect = '%s'", id, effect);
        if (mysql_query(&db, query)) {
            db_query_error(&db);
            mysql_free_result(res);
            mysql_close(&db);
            return;
        }
    }
    else {
        mysql_real_escape_string(&db, escaped_effect, effect, strlen(effect));
        sprintf(query, "INSERT INTO gwangju_sword_master.effect(id, effect, remanet) VALUES ('%s', '%s', '2')", id, escaped_effect);
        if (mysql_query(&db, query)) {
            db_query_error(&db);
            mysql_free_result(res);
            mysql_close(&db);
            return;
        }
    }
    mysql_free_result(res);
    memset(query, 0, sizeof(query));
    sprintf(query, "SELECT speed FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    res = mysql_store_result(&db);
    if (res == NULL) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    row = mysql_fetch_row(res);
    if (row == NULL) {
        db_query_error(&db);
        mysql_free_result(res);
        mysql_close(&db);
        return;
    }
    int speed = atoi(row[0]);
    mysql_free_result(res);
    FILE* file = fopen("speed_state.txt", "w");
    memset(query, 0, sizeof(query));
    fprintf(file, "%d", speed);
    fclose(file);
    sprintf(query, "UPDATE gwangju_sword_master.user_state SET speed = 1 WHERE id = '%s'", id);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    mysql_close(&db);
}

void Powerup_insert(char id[], const char* effect) {
    char query[512];
    char escaped_effect[255];
    memset(query, 0, sizeof(query));
    memset(escaped_effect, 0, sizeof(escaped_effect));
    MYSQL db;
    connect_to_db(&db);
    sprintf(query, "SELECT effect FROM gwangju_sword_master.effect WHERE id = '%s' AND effect = '%s'", id, effect);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    MYSQL_RES* res = mysql_store_result(&db);
    if (res == NULL) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    MYSQL_ROW row = mysql_fetch_row(res);
    if (row != NULL) {
        sprintf(query, "UPDATE gwangju_sword_master.effect SET remanet = '2' WHERE id = '%s' AND effect = '%s'", id, effect);
        if (mysql_query(&db, query)) {
            db_query_error(&db);
            mysql_free_result(res);
            mysql_close(&db);
            return;
        }
    }
    else {
        mysql_real_escape_string(&db, escaped_effect, effect, strlen(effect));
        sprintf(query, "INSERT INTO gwangju_sword_master.effect(id, effect, remanet) VALUES ('%s', '%s', '2')", id, escaped_effect);
        if (mysql_query(&db, query)) {
            db_query_error(&db);
            mysql_free_result(res);
            mysql_close(&db);
            return;
        }
    }
    mysql_free_result(res);
    memset(query, 0, sizeof(query));
    sprintf(query, "SELECT attack FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    res = mysql_store_result(&db);
    if (res == NULL) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    row = mysql_fetch_row(res);
    if (row == NULL) {
        db_query_error(&db);
        mysql_free_result(res);
        mysql_close(&db);
        return;
    }
    int attack = atoi(row[0]);
    mysql_free_result(res);
    FILE* file = fopen("ackplus_state.txt", "w");
    memset(query, 0, sizeof(query));
    int attack_decrease = attack + (int)(attack * 0.1);
    fprintf(file, "%d", attack);
    fclose(file);
    sprintf(query, "UPDATE gwangju_sword_master.user_state SET attack = %d WHERE id = '%s'", attack_decrease, id);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    mysql_close(&db);
}

void Burn(char id[]) {
	Burn_insert(id, "burn");
	return;
}

void Burn_insert(char id[], const char* effect) {
    char query[512];
    char escaped_effect[255];
    memset(query, 0, sizeof(query));
    memset(escaped_effect, 0, sizeof(escaped_effect));
    MYSQL db;
    connect_to_db(&db);
    sprintf(query, "SELECT effect FROM gwangju_sword_master.effect WHERE id = '%s' AND effect = '%s'", id, effect);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    MYSQL_RES* res = mysql_store_result(&db);
    if (res == NULL) {
        db_query_error(&db);
        mysql_close(&db);
        return;
    }
    MYSQL_ROW row = mysql_fetch_row(res);
    if (row != NULL) {
        sprintf(query, "UPDATE gwangju_sword_master.effect SET remanet = '2' WHERE id = '%s' AND effect = '%s'", id, effect);
        if (mysql_query(&db, query)) {
            db_query_error(&db);
            mysql_free_result(res);
            mysql_close(&db);
            return;
        }
    }
    else {
        mysql_real_escape_string(&db, escaped_effect, effect, strlen(effect));
        sprintf(query, "INSERT INTO gwangju_sword_master.effect(id, effect, remanet) VALUES ('%s', '%s', '2')", id, escaped_effect);
        if (mysql_query(&db, query)) {
            db_query_error(&db);
            mysql_free_result(res);
            mysql_close(&db);
            return;
        }
    }
    mysql_free_result(res);
    memset(query, 0, sizeof(query));
    mysql_close(&db);
}