#pragma once

#ifndef MOP_DICTIONARY_H
#define MOP_DICTIONARY_H

typedef struct {
    char name[20];
    int attack;
    int defense;
    int speed;
} Monster;

Monster goblin(void);
Monster slime(void);
Monster bat(void);
Monster oak(void);
Monster wolfman(void);
Monster magician(void);
Monster dragon(void);

#endif 