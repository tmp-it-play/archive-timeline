#include "superclass.h"

void Health_Club_conn(char id[]) {
    memset(string, 0, sizeof(string));
    unsigned int line = 0;
    unsigned int final_y = 2;
    memset(string, 0, sizeof(string));
    char text[100] = "헬스장을 발견했다!";
    int console_width = 120 - 32 + 1;
    int console_height = 17 - 2 + 1;
    int start_x = 32;
    int start_y = 2;
    unsigned int text_length = strlen(text);
    unsigned int i = 0;
    while (i < text_length) {
        int current_x = start_x;
        int current_y = start_y + line;
        int line_length = 0;
        while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
            line_length++;
        }
        current_x = start_x + (console_width - line_length) / 2;
        gotoxy(current_x, current_y);
        for (int j = 0; j < line_length; j++) {
            printf("%c", text[i + j]);
            fflush(stdout);
            Sleep(50);
        }
        i += line_length;
        if (text[i] == '\n') {
            i++;
        }
        line++;
        if (line >= console_height) {
            break;
        }
    }
    final_y = start_y + line;
    int message_x = start_x + (console_width - 27) / 2;
    gotoxy(message_x - 3, final_y + 4);
    Sleep(775);
    printf("> 뎀벨을 든다         런닝머신을 탄다");
    CursorView(0);
    int n, x = 60, y = final_y + 4;
    gotoxy(x, y);
    printf(">");

    while (true) {
        n = KeyControl();
        switch (n) {
        case RIGHT: {
            gotoxy(x, y);
            printf(" ");
            x = (x == 60) ? 80 : 60;
            gotoxy(x, y);
            printf(">");
            break;
        }
        case LEFT: {
            gotoxy(x, y);
            printf(" ");
            x = (x == 80) ? 60 : 81;
            gotoxy(x, y);
            printf(">");
            break;
        }
        case SUBMIT: {
            Clear_Gamelog();
            if (x == 60) {
                MYSQL db;
                connect_to_db(&db);
                char q[255];
                Clear_Gamelog();
                line = 0;
                final_y = 2;
                line = 0;
                final_y = 2;
                memset(text, 0, sizeof(text));
                int compare = rand() % 100;
                int cap = rand() % 30;
                if (cap > compare) {
                    char text[100] = "근육이 빵빵해졌다!!!";
                    console_width = 120 - 32 + 1;
                    console_height = 17 - 2 + 1;
                    start_x = 32;
                    start_y = 2;
                    text_length = strlen(text);
                    i = 0;
                    while (i < text_length) {
                        int current_x = start_x;
                        int current_y = start_y + line;
                        int line_length = 0;
                        while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                            line_length++;
                        }
                        current_x = start_x + (console_width - line_length) / 2;
                        gotoxy(current_x, current_y);
                        for (int j = 0; j < line_length; j++) {
                            printf("%c", text[i + j]);
                            fflush(stdout);
                            Sleep(50);
                        }
                        i += line_length;
                        if (text[i] == '\n') {
                            i++;
                        }
                        line++;
                        if (line >= console_height) {
                            break;
                        }
                        Sleep(48);
                    }
                    sprintf(q, "UPDATE gwangju_sword_master.user_state SET attack=attack+10,defense=defense+5 WHERE id = '%s'", id);
                    if (mysql_query(&db, q)) {
                        db_query_error(&db);
                        mysql_close(&db);
                        exit(0);
                    }
                    final_y = start_y + line;
                    int message_x = start_x + (console_width - 27) / 2;
                    gotoxy(message_x + 3, final_y + 4);
                    Sleep(575);
                    setRGBColor(0, 255, 0);
                    printf("[공격력이 10 증가했다]");
                    resetColor();
                    Sleep(48);
                    mysql_close(&db);
                    Sleep(2000);
                    return;
                }
                else {
                    char text[100] = "마물들의 헬스장은 인간에게 무리였다...";
                    console_width = 120 - 32 + 1;
                    console_height = 17 - 2 + 1;
                    start_x = 32;
                    start_y = 2;
                    text_length = strlen(text);
                    i = 0;
                    while (i < text_length) {
                        int current_x = start_x;
                        int current_y = start_y + line;
                        int line_length = 0;
                        while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                            line_length++;
                        }
                        current_x = start_x + (console_width - line_length) / 2;
                        gotoxy(current_x, current_y + 3);
                        for (int j = 0; j < line_length; j++) {
                            printf("%c", text[i + j]);
                            fflush(stdout);
                            Sleep(50);
                        }
                        i += line_length;
                        if (text[i] == '\n') {
                            i++;
                        }
                        line++;
                        if (line >= console_height) {
                            break;
                        }
                    }
                    final_y = start_y + line;
                    int message_x = start_x + (console_width - 27) / 2;
                    gotoxy(message_x + 1, final_y + 4);
                    Sleep(575);
                    sprintf(q, "UPDATE gwangju_sword_master.user_state SET attack = attack - 5 WHERE id = '%s'", id);
                    connect_to_db(&db);
                    if (mysql_query(&db, q)) {
                        db_query_error(&db);
                        mysql_close(&db);
                        exit(0);
                    }
                    setRGBColor(255, 0, 0);
                    printf("[공격력이 5 감소했다]");
                    resetColor();
                    Sleep(1988);
                    memset(q, 0, sizeof(q));
                    mysql_close(&db);
                    return;
                }
            }
            else {
                MYSQL db;
                connect_to_db(&db);
                char q[255];
                Clear_Gamelog();
                line = 0;
                final_y = 2;
                line = 0;
                final_y = 2;
                memset(text, 0, sizeof(text));
                int compare = rand() % 100;
                int cap = rand() % 30;
                if (cap > compare) {
                    char text[100] = "이제 더 날쌔게 달릴 수 있다!";
                    console_width = 120 - 32 + 1;
                    console_height = 17 - 2 + 1;
                    start_x = 32;
                    start_y = 2;
                    text_length = strlen(text);
                    i = 0;
                    while (i < text_length) {
                        int current_x = start_x;
                        int current_y = start_y + line;
                        int line_length = 0;
                        while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                            line_length++;
                        }
                        current_x = start_x + (console_width - line_length) / 2;
                        gotoxy(current_x, current_y);
                        for (int j = 0; j < line_length; j++) {
                            printf("%c", text[i + j]);
                            fflush(stdout);
                            Sleep(50);
                        }
                        i += line_length;
                        if (text[i] == '\n') {
                            i++;
                        }
                        line++;
                        if (line >= console_height) {
                            break;
                        }
                        Sleep(48);
                    }
                    sprintf(q, "UPDATE gwangju_sword_master.user_state SET speed=speed+10,defense=defense+5 WHERE id = '%s'", id);
                    if (mysql_query(&db, q)) {
                        db_query_error(&db);
                        mysql_close(&db);
                        exit(0);
                    }
                    final_y = start_y + line;
                    int message_x = start_x + (console_width - 27) / 2;
                    gotoxy(message_x + 1, final_y + 4);
                    Sleep(575);
                    setRGBColor(0, 255, 0);
                    printf("[회피률이 10%% 증가했다]");
                    resetColor();
                    Sleep(48);
                    mysql_close(&db);
                    Sleep(2000);
                    return;
                }
                else {
                    char text[100] = "마물들의 헬스장은 인간에게 무리였다...";
                    console_width = 120 - 32 + 1;
                    console_height = 17 - 2 + 1;
                    start_x = 32;
                    start_y = 2;
                    text_length = strlen(text);
                    i = 0;
                    while (i < text_length) {
                        int current_x = start_x;
                        int current_y = start_y + line;
                        int line_length = 0;
                        while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                            line_length++;
                        }
                        current_x = start_x + (console_width - line_length) / 2;
                        gotoxy(current_x, current_y + 3);
                        for (int j = 0; j < line_length; j++) {
                            printf("%c", text[i + j]);
                            fflush(stdout);
                            Sleep(50);
                        }
                        i += line_length;
                        if (text[i] == '\n') {
                            i++;
                        }
                        line++;
                        if (line >= console_height) {
                            break;
                        }
                    }
                    final_y = start_y + line;
                    int message_x = start_x + (console_width - 27) / 2;
                    sprintf(q,"SELECT speed FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
                    if (mysql_query(&db, q)) {
						db_query_error(&db);
						mysql_close(&db);
						exit(0);
					}
                    MYSQL_RES* result = mysql_store_result(&db);
                    MYSQL_ROW row = mysql_fetch_row(result);
                    int speed = atoi(row[0]);
                    memset(q, 0, sizeof(q));
                    if (speed - 5 < 0) {
						sprintf(q, "UPDATE gwangju_sword_master.user_state SET speed = 0 WHERE id = '%s'", id);
					}
                    else {
                        sprintf(q, "UPDATE gwangju_sword_master.user_state SET speed = speed - 5 WHERE id = '%s'", id);
                    }
                    gotoxy(message_x + 2, final_y + 4);
                    Sleep(575);
                    if (mysql_query(&db, q)) {
                        db_query_error(&db);
                        mysql_close(&db);
                        exit(0);
                    }
                    setRGBColor(255, 0, 0);
                    printf("[회피률이 5%% 감소했다]");
                    resetColor();
                    Sleep(1988);
                    memset(q, 0, sizeof(q));
                    mysql_free_result(result);
                    mysql_close(&db);
                    return;
                }
                }
        }
        default: {
            continue;
        }
        }
    }
    return;
}

void Whisper_conn(char id[]) {
    memset(string, 0, sizeof(string));
    unsigned int line = 0;
    unsigned int final_y = 2;
    memset(string, 0, sizeof(string));
    char text[100] = "잠시 휴식을 취하던 중 당신의 귓가에 알 수 없는 소리가 들려옵니다...";
    int console_width = 120 - 32 + 1;
    int console_height = 17 - 2 + 1;
    int start_x = 32;
    int start_y = 2;
    unsigned int text_length = strlen(text);
    unsigned int i = 0;
    while (i < text_length) {
        int current_x = start_x;
        int current_y = start_y + line;
        int line_length = 0;
        while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
            line_length++;
        }
        current_x = start_x + (console_width - line_length) / 2;
        gotoxy(current_x, current_y);
        for (int j = 0; j < line_length; j++) {
            printf("%c", text[i + j]);
            fflush(stdout);
            Sleep(50);
        }
        i += line_length;
        if (text[i] == '\n') {
            i++;
        }
        line++;
        if (line >= console_height) {
            break;
        }
    }
    final_y = start_y + line;
    int message_x = start_x + (console_width - 27) / 2;
    gotoxy(message_x - 10, final_y + 4);
    Sleep(775);
    printf("> 귀를 기울인다         무시하고 잠에 든다");
    CursorView(0);
    int n, x = 53, y = final_y + 4;
    gotoxy(x, y);
    printf(">");

    while (true) {
        n = KeyControl();
        switch (n) {
        case RIGHT: {
            gotoxy(x, y);
            printf(" ");
            x = (x == 53) ? 75 : 53;
            gotoxy(x, y);
            printf(">");
            break;
        }
        case LEFT: {
            gotoxy(x, y);
            printf(" ");
            x = (x == 75) ? 53 : 75;
            gotoxy(x, y);
            printf(">");
            break;
        }
        case SUBMIT: {
            Clear_Gamelog();
            if (x == 53) {
                MYSQL db;
                connect_to_db(&db);
                char q[255];
                Clear_Gamelog();
                line = 0;
                final_y = 2;
                line = 0;
                final_y = 2;
                memset(text, 0, sizeof(text));
                char text[100] = "선은 나아가고 악은 갇치리라.....";
                console_width = 120 - 32 + 1;
                console_height = 17 - 2 + 1;
                start_x = 32;
                start_y = 2;
                text_length = strlen(text);
                i = 0;
                while (i < text_length) {
                    int current_x = start_x;
                    int current_y = start_y + line;
                    int line_length = 0;
                    while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                        line_length++;
                    }
                    current_x = start_x + (console_width - line_length) / 2;
                    gotoxy(current_x, current_y);
                    for (int j = 0; j < line_length; j++) {
                        printf("%c", text[i + j]);
                        fflush(stdout);
                        Sleep(50);
                    }
                    i += line_length;
                    if (text[i] == '\n') {
                        i++;
                    }
                    line++;
                    if (line >= console_height) {
                        break;
                    }
                    Sleep(48);
                }
                sprintf(q, "UPDATE gwangju_sword_master.user_state SET good_and_evil = 1 WHERE id = '%s'", id);
                if (mysql_query(&db, q)) {
                    db_query_error(&db);
                    mysql_close(&db);
                    exit(0);
                }
                mysql_close(&db);
                Sleep(2000);
                return;
            }
            else {
                MYSQL db;
                char q[255];
                line = 0;
                final_y = 2;
                line = 0;
                final_y = 2;
                memset(text, 0, sizeof(text));
                char text[100] = "편히 잠을 잤다";
                console_width = 120 - 32 + 1;
                console_height = 17 - 2 + 1;
                start_x = 32;
                start_y = 2;
                text_length = strlen(text);
                i = 0;
                while (i < text_length) {
                    int current_x = start_x;
                    int current_y = start_y + line;
                    int line_length = 0;
                    while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                        line_length++;
                    }
                    current_x = start_x + (console_width - line_length) / 2;
                    gotoxy(current_x, current_y + 3);
                    for (int j = 0; j < line_length; j++) {
                        printf("%c", text[i + j]);
                        fflush(stdout);
                        Sleep(50);
                    }
                    i += line_length;
                    if (text[i] == '\n') {
                        i++;
                    }
                    line++;
                    if (line >= console_height) {
                        break;
                    }
                }
                final_y = start_y + line;
                int message_x = start_x + (console_width - 27) / 2;
                gotoxy(message_x + 5, final_y + 4);
                Sleep(575);
                sprintf(q, "SELECT hp, max_hp FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
                connect_to_db(&db);
                if (mysql_query(&db, q)) {
                    db_query_error(&db);
                    mysql_close(&db);
                    exit(0);
                }
                MYSQL_RES* result = mysql_store_result(&db);
                MYSQL_ROW row = mysql_fetch_row(result);
                int max_hp = atoi(row[1]);
                int hp = atoi(row[0]);
                if (hp + 25 > max_hp) {
                    hp = max_hp;
                }
                else {
                    hp += 25;
                }
                setRGBColor(0, 212, 0);
                printf("[HP가 회복되었다]");
                resetColor();
                Sleep(48);
                memset(q, 0, sizeof(q));
                sprintf(q, "UPDATE gwangju_sword_master.user_state SET good_and_evil = -1, hp = %d WHERE id = '%d'", hp, id);
                if (mysql_query(&db, q)) {
                    db_query_error(&db);
                    mysql_close(&db);
                    exit(0);
                }
                mysql_free_result(result);
                mysql_close(&db);
                Sleep(2000);
                return;
            }
        }
        default: {
            continue;
        }
        }
    }
    return;
}

void Heavy_Maichgun_conn(char id[]) {
    memset(string, 0, sizeof(string));
    unsigned int line = 0;
    unsigned int final_y = 2;
    memset(string, 0, sizeof(string));
    char text[100] = "할아버지가 기둥에 묶여있다!";
    int console_width = 120 - 32 + 1;
    int console_height = 17 - 2 + 1;
    int start_x = 32;
    int start_y = 2;
    unsigned int text_length = strlen(text);
    unsigned int i = 0;
    while (i < text_length) {
        int current_x = start_x;
        int current_y = start_y + line;
        int line_length = 0;
        while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
            line_length++;
        }
        current_x = start_x + (console_width - line_length) / 2;
        gotoxy(current_x, current_y);
        for (int j = 0; j < line_length; j++) {
            printf("%c", text[i + j]);
            fflush(stdout);
            Sleep(50);
        }
        i += line_length;
        if (text[i] == '\n') {
            i++;
        }
        line++;
        if (line >= console_height) {
            break;
        }
    }
    final_y = start_y + line;
    int message_x = start_x + (console_width - 27) / 2;
    gotoxy(message_x - 6, final_y + 4);
    Sleep(775);
    printf("> 풀어준다         무시하고 지나친다");
    CursorView(0);
    int n, x = 57, y = final_y + 4;
    gotoxy(x, y);
    printf(">");

    while (true) {
        n = KeyControl();
        switch (n) {
        case RIGHT: {
            gotoxy(x, y);
            printf(" ");
            x = (x == 57) ? 74 : 57;
            gotoxy(x, y);
            printf(">");
            break;
        }
        case LEFT: {
            gotoxy(x, y);
            printf(" ");
            x = (x == 74) ? 57 : 74;
            gotoxy(x, y);
            printf(">");
            break;
        }
        case SUBMIT: {
            Clear_Gamelog();
            if (x == 57) {
                MYSQL db;
                connect_to_db(&db);
                char q[255];
                Clear_Gamelog();
                line = 0;
                final_y = 2;
                line = 0;
                final_y = 2;
                memset(text, 0, sizeof(text));
                char text[100] = "'Heavy Machinegun'이라고 적힌 총을 선물로 주고 떠나갔다...";
                console_width = 120 - 32 + 1;
                console_height = 17 - 2 + 1;
                start_x = 32;
                start_y = 2;
                text_length = strlen(text);
                i = 0;
                while (i < text_length) {
                    int current_x = start_x;
                    int current_y = start_y + line;
                    int line_length = 0;
                    while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                        line_length++;
                    }
                    current_x = start_x + (console_width - line_length) / 2;
                    gotoxy(current_x, current_y);
                    for (int j = 0; j < line_length; j++) {
                        printf("%c", text[i + j]);
                        fflush(stdout);
                        Sleep(50);
                    }
                    i += line_length;
                    if (text[i] == '\n') {
                        i++;
                    }
                    line++;
                    if (line >= console_height) {
                        break;
                    }
                    Sleep(48);
                }
                final_y = start_y + line;
                memset(q, 0, sizeof(q));
                sprintf(q,"SELECT attack FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
                if (mysql_query(&db, q)) {
                    db_query_error(&db);
                    mysql_close(&db);
                    sleep(2000);
                    exit(0);
                }
                MYSQL_RES* result = mysql_store_result(&db);
                MYSQL_ROW row = mysql_fetch_row(result);
                int attack = atoi(row[0]);
                int gangshin_ack = 3 * attack / 100;
                int message_x = start_x + (console_width - 27) / 2;
                gotoxy(message_x + 3, final_y + 4);
                Sleep(575);
                setRGBColor(0, 212, 0);
                printf("[공격력이 3%% 증가했다]");
                resetColor();
                Sleep(48);
                memset(q, 0, sizeof(q));
                sprintf(q, "UPDATE gwangju_sword_master.user_state SET good_and_evil=good_and_evil+1,attack=attack+%d WHERE id = '%s'", gangshin_ack, id);
                if (mysql_query(&db, q)) {
                    db_query_error(&db);
                    mysql_free_result(result);
                    mysql_close(&db);
                    exit(0);
                }
                mysql_free_result(result);
                mysql_close(&db);
                Sleep(3000);
                return;
            }
            else {
                MYSQL db;
                char q[255];
                line = 0;
                final_y = 2;
                line = 0;
                final_y = 2;
                memset(text, 0, sizeof(text));
                char text[100] = "뒤에서 총성이 들려...온다?\n"
                    "총알이 날아와 몸통을 관통당했다...";
                console_width = 120 - 32 + 1;
                console_height = 17 - 2 + 1;
                start_x = 32;
                start_y = 2;
                text_length = strlen(text);
                i = 0;
                while (i < text_length) {
                    int current_x = start_x;
                    int current_y = start_y + line;
                    int line_length = 0;
                    while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                        line_length++;
                    }
                    current_x = start_x + (console_width - line_length) / 2;
                    gotoxy(current_x, current_y + 3);
                    for (int j = 0; j < line_length; j++) {
                        printf("%c", text[i + j]);
                        fflush(stdout);
                        Sleep(50);
                    }
                    i += line_length;
                    if (text[i] == '\n') {
                        i++;
                    }
                    line++;
                    if (line >= console_height) {
                        break;
                    }
                }
                final_y = start_y + line;
                int message_x = start_x + (console_width - 27) / 2;
                gotoxy(message_x + 5, final_y + 4);
                Sleep(575);
                sprintf(q, "SELECT hp, max_hp FROM gwangju_sword_master.user_state WHERE id = '%s'", id);
                connect_to_db(&db);
                if (mysql_query(&db, q)) {
                    db_query_error(&db);
                    mysql_close(&db);
                    exit(0);
                }
                MYSQL_RES* result = mysql_store_result(&db);
                MYSQL_ROW row = mysql_fetch_row(result);
                int max_hp = atoi(row[1]);
                int hp = atoi(row[0]);
                if (hp + 25 > max_hp) {
                    hp = max_hp;
                }
                else {
                    hp += 25;
                }
                setRGBColor(249, 0, 0);
                printf("[HP를 10 잃었다]");
                resetColor();
                Sleep(48);
                memset(q, 0, sizeof(q));
                sprintf(q, "UPDATE gwangju_sword_master.user_state SET good_and_evil = good_and_evil-1, hp = hp-10 WHERE id = '%d'", id);
                if (mysql_query(&db, q)) {
                    db_query_error(&db);
                    mysql_close(&db);
                    exit(0);
                }
                mysql_free_result(result);
                mysql_close(&db);
                Sleep(2000);
                return;
            }
        }
        default: {
            continue;
        }
        }
    }
    return;
}

void Rooting_conn(char id[]) {
    memset(string, 0, sizeof(string));
    unsigned int line = 0;
    unsigned int final_y = 2;
    char text[100] = "앞서 나아갔던 또다른 기사의 시체가 있다...";
    int console_width = 120 - 32 + 1;
    int console_height = 17 - 2 + 1;
    int start_x = 32;
    int start_y = 2;
    unsigned int text_length = strlen(text);
    unsigned int i = 0;
    while (i < text_length) {
        int current_x = start_x;
        int current_y = start_y + line;
        int line_length = 0;
        while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
            line_length++;
        }
        current_x = start_x + (console_width - line_length) / 2;
        gotoxy(current_x, current_y);
        for (int j = 0; j < line_length; j++) {
            printf("%c", text[i + j]);
            fflush(stdout);
            Sleep(50);
        }
        i += line_length;
        if (text[i] == '\n') {
            i++;
        }
        line++;
        if (line >= console_height) {
            break;
        }
    }
    final_y = start_y + line;
    int message_x = start_x + (console_width - 27) / 2;
    gotoxy(message_x - 8, final_y + 4);
    Sleep(775);
    printf("> 시체를 뒤진다         무덤을 만들어준다");
    CursorView(0);
    int n, x = 55, y = final_y + 4;
    gotoxy(x, y);
    printf(">");
    while (true) {
        n = KeyControl();
        if (n == RIGHT || n == LEFT) {
            gotoxy(x, y);
            printf(" ");
            x = (x == 55) ? 77 : 55;
            gotoxy(x, y);
            printf(">");
        }
        else if (n == SUBMIT) {
            Clear_Gamelog();
            if (x == 55) {
                MYSQL db;
                connect_to_db(&db);
                char q[255];
                Clear_Gamelog();
                line = 0;
                final_y = 2;
                memset(text, 0, sizeof(text));
                strcpy(text, "시체에서 가족사진 말곤 얻을 만한것이 없었다...");
                console_width = 120 - 32 + 1;
                console_height = 17 - 2 + 1;
                start_x = 32;
                start_y = 2;
                text_length = strlen(text);
                i = 0;
                while (i < text_length) {
                    int current_x = start_x;
                    int current_y = start_y + line;
                    int line_length = 0;
                    while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                        line_length++;
                    }
                    current_x = start_x + (console_width - line_length) / 2;
                    gotoxy(current_x, current_y);
                    for (int j = 0; j < line_length; j++) {
                        printf("%c", text[i + j]);
                        fflush(stdout);
                        Sleep(50);
                    }
                    i += line_length;
                    if (text[i] == '\n') {
                        i++;
                    }
                    line++;
                    if (line >= console_height) {
                        break;
                    }
                    Sleep(48);
                }
                final_y = start_y + line;
                gotoxy(message_x + 3, final_y + 4);
                Sleep(575);
                setRGBColor(0, 212, 0);
                resetColor();
                Sleep(48);
                sprintf(q, "UPDATE gwangju_sword_master.user_state SET good_and_evil = good_and_evil - 1 WHERE id = '%s'", id);
                if (mysql_query(&db, q)) {
                    db_query_error(&db);
                    mysql_close(&db);
                    exit(0);
                }
                mysql_close(&db);
                Sleep(3000);
                return;
            }
            else {
                MYSQL db;
                char q[255];
                connect_to_db(&db);
                line = 0;
                final_y = 2;
                memset(text, 0, sizeof(text));
                strcpy(text, "기사의 예를 표하며 묘비를 세워줬다.");
                console_width = 120 - 32 + 1;
                console_height = 17 - 2 + 1;
                start_x = 32;
                start_y = 2;
                text_length = strlen(text);
                i = 0;
                while (i < text_length) {
                    int current_x = start_x;
                    int current_y = start_y + line;
                    int line_length = 0;
                    while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                        line_length++;
                    }
                    current_x = start_x + (console_width - line_length) / 2;
                    gotoxy(current_x, current_y + 3);
                    for (int j = 0; j < line_length; j++) {
                        printf("%c", text[i + j]);
                        fflush(stdout);
                        Sleep(50);
                    }
                    i += line_length;
                    if (text[i] == '\n') {
                        i++;
                    }
                    line++;
                    if (line >= console_height) {
                        break;
                    }
                }
                final_y = start_y + line;
                gotoxy(message_x + 5, final_y + 4);
                Sleep(575);
                setRGBColor(249, 0, 0);
                resetColor();
                Sleep(48);
                memset(q, 0, sizeof(q));
                sprintf(q, "UPDATE gwangju_sword_master.user_state SET good_and_evil = good_and_evil + 1 WHERE id = '%s'", id);
                if (mysql_query(&db, q)) {
                    db_query_error(&db);
                    mysql_close(&db);
                    Sleep(1420);
                    exit(0);
                }
                mysql_close(&db);
                Sleep(2000);
                return;
            }
        }
    }
    return;
}

void Mimic_conn(char id[]) {
    memset(string, 0, sizeof(string));
    unsigned int line = 0;
    unsigned int final_y = 2;
    char text[100] = "상자을 발견했다!!";
    int console_width = 120 - 32 + 1;
    int console_height = 17 - 2 + 1;
    int start_x = 32;
    int start_y = 2;
    unsigned int text_length = strlen(text);
    unsigned int i = 0;
    while (i < text_length) {
        int current_x = start_x;
        int current_y = start_y + line;
        int line_length = 0;
        while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
            line_length++;
        }
        current_x = start_x + (console_width - line_length) / 2;
        gotoxy(current_x, current_y);
        for (int j = 0; j < line_length; j++) {
            printf("%c", text[i + j]);
            fflush(stdout);
            Sleep(50);
        }
        i += line_length;
        if (text[i] == '\n') {
            i++;
        }
        line++;
        if (line >= console_height) {
            break;
        }
    }
    final_y = start_y + line;
    int message_x = start_x + (console_width - 27) / 2;
    gotoxy(message_x - 2, final_y + 4);
    Sleep(775);
    printf("> 열어본다         무시하고 지나간다");
    CursorView(0);
    int n, x = 61, y = final_y + 4;
    gotoxy(x, y);
    printf(">");
    while (true) {
        n = KeyControl();
        if (n == RIGHT || n == LEFT) {
            gotoxy(x, y);
            printf(" ");
            x = (x == 61) ? 78 : 61;
            gotoxy(x, y);
            printf(">");
        }
        else if (n == SUBMIT) {
            Clear_Gamelog();
            if (x == 61) {
                MYSQL db;
                connect_to_db(&db);
                char q[255];
                Clear_Gamelog();
                line = 0;
                final_y = 2;
                memset(text, 0, sizeof(text));
                strcpy(text, "책에서만 보단 미믹이 튀어나왔다!!!!....");
                console_width = 120 - 32 + 1;
                console_height = 17 - 2 + 1;
                start_x = 32;
                start_y = 2;
                text_length = strlen(text);
                i = 0;
                while (i < text_length) {
                    int current_x = start_x;
                    int current_y = start_y + line;
                    int line_length = 0;
                    while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                        line_length++;
                    }
                    current_x = start_x + (console_width - line_length) / 2;
                    gotoxy(current_x, current_y);
                    for (int j = 0; j < line_length; j++) {
                        printf("%c", text[i + j]);
                        fflush(stdout);
                        Sleep(50);
                    }
                    i += line_length;
                    if (text[i] == '\n') {
                        i++;
                    }
                    line++;
                    if (line >= console_height) {
                        break;
                    }
                    Sleep(48);
                }
                final_y = start_y + line;
                int message_x = start_x + (console_width - 27) / 2;
                gotoxy(message_x + 4, final_y + 4);
                Sleep(575);
                setRGBColor(249, 0, 0);
                printf("[HP를 20 잃었다]");
                resetColor();
                Sleep(48);
                final_y = start_y + line;
                gotoxy(message_x + 3, final_y + 4);
                Sleep(575);
                setRGBColor(0, 212, 0);
                resetColor();
                Sleep(48);
                sprintf(q, "UPDATE gwangju_sword_master.user_state SET good_and_evil = hp-10 WHERE id = '%s'", id);
                if (mysql_query(&db, q)) {
                    db_query_error(&db);
                    mysql_close(&db);
                    exit(0);
                }
                mysql_close(&db);
                Sleep(3000);
                return;
            }
            else {
                line = 0;
                final_y = 2;
                memset(text, 0, sizeof(text));
                strcpy(text, "아무일도 없이 지나갔다...");
                console_width = 120 - 32 + 1;
                console_height = 17 - 2 + 1;
                start_x = 32;
                start_y = 2;
                text_length = strlen(text);
                i = 0;
                while (i < text_length) {
                    int current_x = start_x;
                    int current_y = start_y + line;
                    int line_length = 0;
                    while (i + line_length < text_length && text[i + line_length] != '\n' && line_length < console_width) {
                        line_length++;
                    }
                    current_x = start_x + (console_width - line_length) / 2;
                    gotoxy(current_x, current_y + 3);
                    for (int j = 0; j < line_length; j++) {
                        printf("%c", text[i + j]);
                        fflush(stdout);
                        Sleep(50);
                    }
                    i += line_length;
                    if (text[i] == '\n') {
                        i++;
                    }
                    line++;
                    if (line >= console_height) {
                        break;
                    }
                }
                final_y = start_y + line;
                gotoxy(message_x + 5, final_y + 4);
                Sleep(575);
                setRGBColor(249, 0, 0);
                resetColor();
                Sleep(48);
                Sleep(1000);
                return;
            }
        }
    }
    return;
}