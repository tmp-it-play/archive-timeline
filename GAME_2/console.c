#include "superclass.h"
#include "player_state.h"
#include "mop_dictionary.h"
#include "db_event.h"
#include "color.h"

char cheat_code[40];
int cheat_value = (int)false;

void Input_Cheat(Monster m[], char id[]) {
    while (getchar() != '\n');
    CursorView(1);
    memset(cheat_code, 0, sizeof(cheat_code));
    memset(string, 0, sizeof(string));
    setRGBColor(102, 204, 0);
    strcpy(string, "Input Cheat Code: ");
    scrollUpImproved(32, 3, 17);
    printAt(32, 17, string);
    gotoxy(32 + strlen(string), 17);
    char input[256];
    fgets(input, sizeof(input), stdin);
    int parsed = sscanf(input, "%s %d", cheat_code, &cheat_value);
    if (parsed < 1) {
        memset(string, 0, sizeof(string));
        strcpy(string, "Invalid input format!");
        scrollUpImproved(32, 3, 17);
        setRGBColor(255, 0, 0);
        printAt(32, 17, string);
        gotoxy(32 + strlen(string), 17);
        resetColor();
        return;
    }
    if (strcmp(cheat_code, "godmode") == 0) {
        if (parsed != 1) {
            memset(string, 0, sizeof(string));
            strcpy(string, "Invalid input format for godmode!");
            scrollUpImproved(32, 3, 17);
            setRGBColor(255, 0, 0);
            printAt(32, 17, string);
            gotoxy(32 + strlen(string), 17);
            resetColor();
            return;
        }
        memset(string, 0, sizeof(string));
        strcpy(string, "God Mode Activated!");
        scrollUpImproved(32, 3, 17);
        setRGBColor(255, 0, 0);
        printAt(32, 17, string);
        gotoxy(32 + strlen(string), 17);
        resetColor();
        MYSQL db;
        mysql_init(&db);
        if (mysql_real_connect(&db, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0) == NULL) {
            db_connect_error(&db);
            exit(0);
        }
        char query[255];
        sprintf(query, "UPDATE gwangju_sword_master.user_state SET hp=999,mp=999,max_hp=999,max_mp=999,level=99,speed=99,attack=999,defense=999,cri_chance=99,levelup_requirement=9999,levelup_point=-999 WHERE id = '%s'", id);
        if (mysql_query(&db, query)) {
            db_query_error(&db);
            exit(0);
        }
        now_level(id);
        now_state(id);
        hp_mp_bar(id);
        return;
    }
    else if (strcmp(cheat_code, "attack_change") == 0) {
        if (parsed != 2) {
            memset(string, 0, sizeof(string));
            strcpy(string, "Invalid input format for attack_change!");
            scrollUpImproved(32, 3, 17);
            setRGBColor(255, 0, 0);
            printAt(32, 17, string);
            gotoxy(32 + strlen(string), 17);
            resetColor();
            return;
        }
        if (cheat_value < 0 || cheat_value > 999) {
            memset(string, 0, sizeof(string));
            strcpy(string, "Invalid Value!");
            scrollUpImproved(32, 3, 17);
            setRGBColor(255, 0, 0);
            printAt(32, 17, string);
            gotoxy(32 + strlen(string), 17);
            resetColor();
            return;
        }
        memset(string, 0, sizeof(string));
        sprintf(string, "Attack value changed to %d", cheat_value);
        scrollUpImproved(32, 3, 17);
        setRGBColor(255, 0, 0);
        printAt(32, 17, string);
        gotoxy(32 + strlen(string), 17);
        resetColor();
        MYSQL db;
        mysql_init(&db);
        if (mysql_real_connect(&db, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0) == NULL) {
            db_connect_error(&db);
            exit(0);
        }
        char query[255];
        sprintf(query, "UPDATE gwangju_sword_master.user_state SET attack=%d WHERE id = '%s'", cheat_value, id);
        if (mysql_query(&db, query)) {
            db_query_error(&db);
            exit(0);
        }
        now_level(id);
        now_state(id);
        hp_mp_bar(id);
        return;
    }
	else if (strcmp(cheat_code, "heal") == 0) {
		memset(string, 0, sizeof(string));
		strcpy(string, "HP Fully Restored!");
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		resetColor();
        MYSQL db;
        mysql_init(&db);
        if (mysql_real_connect(&db, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0) == NULL) {
            db_connect_error(&db);
            exit(0);

        }
        char query[255];
        sprintf(query, "UPDATE gwangju_sword_master.user_state SET hp=max_hp WHERE id = '%s'", id);
        if (mysql_query(&db, query)) {
            db_query_error(&db);
            exit(0);
        }
        return;
	}
	else if (strcmp(cheat_code, "exit") == 0) {
		memset(string, 0, sizeof(string));
		strcpy(string, "Game Exited!");
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		resetColor();
        Sleep(2500);
		exit(0);
	}
	else {
		memset(string, 0, sizeof(string));
		strcpy(string, "Invalid Cheat Code!");
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		resetColor();
	}
	resetColor();
}