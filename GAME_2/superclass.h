#pragma once

#define _CRT_SECURE_NO_WARNINGS
#define	UP 0
#define DOWN 1
#define LEFT 2
#define RIGHT 3
#define SUBMIT 4

#include "stdio.h"
#include "Windows.h"
#include "mysql.h"
#include "conio.h"
#include "stdlib.h"
#include "stralign.h"
#include "stdbool.h"
#include "mop_dictionary.h"

#pragma comment (lib,"libmariadb.lib")
#pragma comment(lib, "user32.lib")

char string[100];

int main(void);
int game_core_code(char id[]);
int mail_send(void);
int loginmenuDraw(void);
int KeyControl(void);
void gotoxy(int x, int y);
void clearLine(int x, int y);
void ClearViewState(void);
void printAt(int x, int y, const char* str);
void scrollUp(int x, int y_start, int y_end);
void scrollUpImproved(int x, int y_end, int y_start);
void ASCII_Art_print(void);
void Program_config(void);
void CursorView(char show);
void sign_up(void);
void sign_in(void);
void Gamemenu(char id[]);
void prologue(short gender, char id[]);
void gender_select(char id[]);
void new_game_reconfirm(char id[]);
void program_off(void);
void save_check(char id[]);
void hp_mp_bar(char id[]);
void mop_hp_bar(int mop_hp, int mop_max_hp, int x, int y, char name[]);
void outline(char id[]);
void setRGBColor(int r, int g, int b);
void resetColor(void);
void stage_1(char id[]);
long long ingame_select(char id[], Monster m[], unsigned short turn, int ix, int iy);
long long mop_turn(char id[], Monster m[], unsigned short stage_turn, int x, int y);