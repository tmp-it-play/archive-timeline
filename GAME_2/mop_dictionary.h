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
long long goblin_skill_1(void);
Monster slime(void);
void slime_skill_1(void);
Monster bat(void);
long long bat_skill_1(void);
long long bat_skill_2(void);
Monster oak(void);
Monster wolfman(void);
Monster magician(void);
Monster dragon(void);

#endif 