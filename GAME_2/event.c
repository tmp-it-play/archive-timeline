#include "superclass.h"

void Whisper(char id[]) {
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
        }
        i += line_length;
        if (text[i] == '\n') {
            i++;
        }
        line++;
        if (line >= console_height) {
            break;
        }
        sleep(50);
    }
    final_y = start_y + line;
    int message_x = start_x + (console_width - 27) / 2;
    printf("%d %d", message_x - 12, final_y + 4);
    gotoxy(message_x - 12, final_y + 4);
    Sleep(775);
    printf("> 귀를 기울인다         무시하고 잠에 든다");
    CursorView(0);
    int n, x = 51, y = 7;
    while (true) {
        n = KeyControl();
        switch (n) {
        case RIGHT: {
            gotoxy(x, y);
            printf(" ");
            if (x = 51) {
                x = 73;
            }
            else {
                x = 51;
            }
            printf(">");
            break;
        }
        case LEFT: {
            gotoxy(x, y);
            printf(" ");
            if (x = 75) {
                x = 51;
            }
            else {
                x = 73;
            }
            printf(">");
            break;
        }
        case SUBMIT: {
            if (x == 51) {
                system("cls");
                printf("당신은 귀를 기울이기로 결정했습니다.\n");
            }
            exit(0);
        }
        default: {
            break;
        }
        }
    }
}