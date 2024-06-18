#include "superclass.h"
#include "stdint.h"

void tutorial(char id[]) {
    system("cls");
    CursorView(0);
    Reline();
    unsigned int bar_length = 10;
    int hp = 650, max_hp = 650, mp = 500, max_mp = 500;
    gotoxy(17, 24);
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 10);
    printf("[%lld/%lld]", hp, max_hp);
    gotoxy(2, 24);
    printf("HP[");
    double hp_percentage = (double)hp / max_hp;
    unsigned int filled_length = (unsigned int)(hp_percentage * bar_length);
    gotoxy(2, 24);
    printf("HP[");
    for (unsigned int i = 0; i < bar_length; i++) {
        if (i < filled_length) {
            printf("■");
        }
        else {
            printf(" ");
        }
    }
    printf("]");
    gotoxy(17, 25);
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 1);
    printf("[%lld/%lld]", mp, max_mp);
    gotoxy(2, 25);
    printf("MP[");
    double mp_percentage = (double)mp / max_mp;
    unsigned int filled_mp_length = (unsigned int)(mp_percentage * bar_length);
    gotoxy(2, 25);
    gotoxy(2, 25);
    printf("MP[");
    for (unsigned int i = 0; i < bar_length; i++) {
        if (i < filled_mp_length) {
            printf("■");
        }
        else {
            printf(" ");
        }
    }
    gotoxy(15, 25);
    printf("]");
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
    gotoxy(2, 15);
    printf("HP:650");
    gotoxy(2, 16);
    printf("MP:500");
    gotoxy(2, 17);
    printf("공격력:600");
    gotoxy(2, 18);
    printf("방어력:145");
    gotoxy(2, 19);
    printf("회피률:15%%");
    gotoxy(2, 20);
    printf("치명타 확률:45%%");
    gotoxy(2, 14);
    int player_level = 20, levelup_point = 0, levelup_requirement = 3000;
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 10);
    printf("Lv.%lld[%lld/%lld]", player_level, levelup_point, levelup_requirement);
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
    char* consoleBuffer = NULL;
    COORD consoleSize;
    char** buffer = &consoleBuffer;
    COORD* size = &consoleSize;
    const char* buffers = consoleBuffer;
    COORD sizes = consoleSize;
    HANDLE hConsoles = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_SCREEN_BUFFER_INFO csbi;
    GetConsoleScreenBufferInfo(hConsoles, &csbi);
    *size = csbi.dwSize;
    DWORD bufferSize = csbi.dwSize.X * csbi.dwSize.Y;
    *buffer = (char*)malloc(bufferSize * sizeof(CHAR_INFO));
    CHAR_INFO* chiBuffers = (CHAR_INFO*)(*buffer);
    COORD bufferCoords = { 0, 0 };
    SMALL_RECT readRegion = { 0, 0, csbi.dwSize.X - 1, csbi.dwSize.Y - 1 };
    ReadConsoleOutput(hConsoles, chiBuffers, csbi.dwSize, bufferCoords, &readRegion);
    SetConsoleOutputCP(CP_UTF8);
    SetConsoleCP(CP_UTF8);
    const char* numbers[1][9] = {
    {
        "   \xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93   ",
    "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
    " \xE2\x96\x93\x20\x20\x20\x20\x20\x20\xE2\x96\x93 ",
    " \xE2\x96\x93\x20\x20\x20\x20\x20\x20\xE2\x96\x93 ",
    " \xE2\x96\x93\x20\x20\x20\x20\x20\x20\xE2\x96\x93 ",
    " \xE2\x96\x93\x20\x20\x20\x20\x20\x20\xE2\x96\x93 ",
    " \xE2\x96\x93\x20\x20\x20\x20\x20\x20\xE2\x96\x93 ",
    "  \xE2\x96\x93\x20\x20\x20\x20\xE2\x96\x93  ",
    "   \xE2\x96\x93\xE2\x96\x93\xE2\x96\x93\xE2\x96\x93   "
    }
    };
    for (int i = 0; i < 9; i++) {
        gotoxy(9, i + 1);
        printf("%s", numbers[0][i]);
    }
    SetConsoleCP(949);
    SetConsoleOutputCP(949);
    unsigned int line = 0;
    unsigned int final_y = 2;
    memset(string, 0, sizeof(string));
    char text[100] = "튜토리얼을 시작하겠습니다.";
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
    gotoxy(message_x, final_y + 4);
    Sleep(775);
    printf("계속하려면 Enter를 누르세요");
    CursorView(0);
    int n;
    while (true) {
        n = KeyControl();
        if (n == SUBMIT) {
            Clear_Gamelog();
            break;
        }
    }
    memset(text, 0, sizeof(text));
    strcpy(text, "방향키와 Enter키를 이용해 여러 전투 선택지를 선택할 수 있습니다");
    gotoxy(37, 23);
    setRGBColor(0, 241, 0);
    printf(">");
    gotoxy(39, 23);
    resetColor();
    printf("공격하기");
    gotoxy(54, 23);
    printf("랜덤 물약 던지기");
    gotoxy(77, 23);
    printf("랜덤 물약 마시기");
    gotoxy(102, 23);
    printf("도망가기");
    console_width = 120 - 32 + 1;
    console_height = 17 - 2 + 1;
    start_x = 32;
    start_y = 2;
    text_length = strlen(text);
    static int x = 37, y = 23;
    static int ix = 32, iy = 17;
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
        }
        i += line_length;
        if (text[i] == '\n') {
            i++;
        }
        line++;
        if (line >= console_height) {
            break;
        }
        final_y = start_y + line;
        int message_x = start_x + (console_width - 27) / 2;
        gotoxy(message_x - 16, final_y + 3);
        printf("왼쪽 또는 오른쪽 방향키를 사용하여 선택지 커서를 5번 옮겨보세요");
    }
    for (int j = 0; j < 6; j++) {
        n = KeyControl();
        switch (n) {
        case RIGHT: {
            gotoxy(x, y);
            printf(" ");
            if (x >= 100) {
                x = 37;
            }
            else if (x == 37) {
                x = 52;
            }
            else if (x == 52) {
                x = 75;
            }
            else {
                x = 100;
            }
            gotoxy(x, y);
            printf(">");
            break;
        }
        case LEFT: {
            gotoxy(x, y);
            printf(" ");
            if (x == 37) {
                x = 100;
            }
            else if (x == 100) {
                x = 75;
            }
            else if (x == 75) {
                x = 52;
            }
            else {
                x = 37;
            }
            gotoxy(x, y);
            printf(">");
            break;
        }
        }
        setRGBColor(0, 241, 0);
        gotoxy(x, y);
        printf(">");
        resetColor();
    }
    gotoxy(x, y);
    printf(" ");
    gotoxy(x, y);
    printf(">");
    Clear_Gamelog();
    gotoxy(x, y);
    printf(" ");
    console_width = 120 - 32 + 1;
    console_height = 17 - 2 + 1;
    start_x = 32;
    start_y = 2;
    strcpy(text, "ESC키를 눌러 서브메뉴를 불러올 수 있습니다");
    text_length = strlen(text);
    ix = 32, iy = 17;
    memset(text, 0, sizeof(text));
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
        }
        i += line_length;
        if (text[i] == '\n') {
            i++;
        }
        line++;
        if (line >= console_height) {
            break;
        }
        final_y = start_y + line;
        int message_x = start_x + (console_width - 27) / 2;
        gotoxy(message_x, final_y + 3);
        printf("ESC키를 눌러보세요");
    }
    while (true) {
        n = KeyControl();
        if (n == ESC) {
            gotoxy(x, y);
            printf(" ");
            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), GREEN);
            for (int i = 11; i <= 18; i++) {
                gotoxy(93, i);
                printf("■");
            }
            for (int i = 93; i < 119; i++) {
                gotoxy(i, 11);
                printf("■");
            }
            for (int i = 11; i <= 19; i++) {
                gotoxy(119, i);
                printf("■");
            }
            for (int i = 93; i < 119; i++) {
                gotoxy(i, 19);
                printf("■");
            }
            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
            gotoxy(97, 13);
            printf("게임 저장하기");
            gotoxy(97, 15);
            printf("메인화면으로 돌아가기");
            gotoxy(97, 17);
            printf("게임 종료하기");
            break;
        }
    }
    gotoxy(x, y);
    printf(" ");
    Sleep(3000);
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), WHITE);
    for (int i = 11; i <= 19; i++) {
        gotoxy(119, i);
        printf("■");
    }
    for (int i = 93; i < 119; i++) {
        gotoxy(i, 19);
        printf("■");
    }
    Clear_Gamelog();
    memset(text, 0, sizeof(text));
    strcpy(text, "기본적인 조작법 튜토리얼을 종료합니다");
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
        }
        i += line_length;
        if (text[i] == '\n') {
            i++;
        }
        line++;
        if (line >= console_height) {
            break;
        }
        final_y = start_y + line;
        int message_x = start_x + (console_width - 27) / 2;
        break;
    }
    Sleep(1910);
    Clear_Gamelog();
    for (int i = 0; i < 120; i++) {
        for (int j = 0; j < 28; j++) {
            gotoxy(i, j);
            printf(" ");
        }
    }
    return;
}