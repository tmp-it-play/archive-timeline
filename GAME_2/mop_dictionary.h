#pragma once

#ifndef MOP_DICTIONARY_H
#define MOP_DICTIONARY_H

typedef struct {
    char name[20];
    int hp;
    int attack;
    int defense;
    int speed;
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
Monster magician(void);
Monster dragon(void);

#endif 