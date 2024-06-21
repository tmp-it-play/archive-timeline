#pragma once

#ifndef MOP_DICTIONARY_H
#define MOP_DICTIONARY_H

typedef struct {
    char name[20];
    int hp;
    int attack;
    int defense;
    int speed;
    char type[50];
} Monster;

Monster goblin(void);
long long goblin_skill_1(char id[], Monster m[], int stage_turn, int x, int y);
Monster slime(void);
void slime_skill_1(void);
Monster bat(void);
long long bat_skill_1(char id[], Monster m[], int stage_turn, int x, int y);
long long bat_skill_2(char id[], Monster m[], int stage_turn, int x, int y);
Monster oak(void);
long long oak_skill_1(char id[], Monster m[], int stage_turn, int x, int y);
Monster wolfman(void);
long long wolfman_skill_1(char id[], Monster m[], int stage_turn, int x, int y);
long long wolfman_skill_2(char id[], Monster m[], int stage_turn, int x, int y);
Monster magician(void);
long long magician_skill_1(char id[], Monster m[], int stage_turn, int x, int y);
Monster dragon(void);
long long dragon_skill_1(char id[], Monster m[], int stage_turn, int x, int y);
Monster Golem(void);
long long Golem_skill_1(char id[], Monster m[], int stage_turn, int x, int y);
Monster Grandis(void);
long long Grandis_skill_1(char id[], Monster m[], int stage_turn, int x, int y);

Monster Whisper(void);
#endif 