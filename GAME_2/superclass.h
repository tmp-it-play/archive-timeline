#pragma once

#define _CRT_SECURE_NO_WARNINGS
#define	UP 0
#define DOWN 1
#define LEFT 2
#define RIGHT 3
#define SUBMIT 4
#define ESC 5
#define CONSOLE 6

#include "stdio.h"
#include "Windows.h"
#include "mysql.h"
#include "conio.h"
#include "stdlib.h"
#include "stralign.h"
#include "stdbool.h"
#include "mop_dictionary.h"
#include "db_event.h"
#include "color.h"
#include "errno.h"
#include "time.h"
#include "string.h"
#include "math.h"
#include "ctype.h"
#include "process.h"
#include "winuser.h"
#include "wincon.h"
#include "io.h"
#include "fcntl.h"
#include "direct.h"
#include "tchar.h"
#include "wchar.h"
#include "locale.h"
#include "errmsg.h"

#pragma comment (lib,"libmariadb.lib")
#pragma comment(lib, "user32.lib")

char string[100];

char RandomPotionThrow(char id[], Monster m[], unsigned short stage_turn, int x, int y);
char RandomPotionDrink(char id[], Monster m[], unsigned short stage_turn, int x, int y);
int main(void);
int game_core_code(char id[]);
int mail_send(void);
int loginmenuDraw(void);
int KeyControl(void);
int Avoidance(char id[], Monster m[], unsigned short stage_turn, int x, int y);
void Reline(void);
void tutorial(char id[]);
void Input_Cheat(Monster m[], char id[]);
void gotoxy(int x, int y);
void clearLine(int x, int y);
void ClearViewState(void);
void printAt(int x, int y, const char* str);
void Resetcount_Print(char id[]);
void scrollUp(int x, int y_start, int y_end);
void scrollUpImproved(int x, int y_end, int y_start);
void scrollDownImproved(int x, int y_start, int y_end);
void scrollup_motion(int initial_x, int initial_y);
void ASCII_Art_print(void);
void Program_config(void);
void CursorView(char show);
void sign_up(void);
void sign_in(void);
void Gamemenu(char id[]);
void prologue(short gender, char id[], MYSQL* conn);
void Clear_Gamelog(void);
void gender_select(char id[]);
void new_game_reconfirm(char id[]);
void program_off(void);
void save_check(char id[]);
void hp_mp_bar(char id[]);
void mop_hp_bar(int mop_hp, int mop_max_hp, int x, int y, char name[]);
void outline(char id[]);
void setRGBColor(int r, int g, int b);
void resetColor(void);
void drop_booty(char id[], char name[]);
void Effect_Counter(char id[]);
void check_and_delete_expired_effects_fug(const char* id, MYSQL* db);
void stage_1(char id[], int mop_num);
void stage_2(char id[], int mop_num);
void Fugitive(char id[]);
void Slow(char id[]);
void Powerup(char id[]);
void Remover_File(void);
long long ingame_select(char id[], Monster m[], unsigned short turn, int ix, int iy);
long long mop_turn(char id[], Monster m[], unsigned short stage_turn, int x, int y);