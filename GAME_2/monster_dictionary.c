#include "superclass.h"
#include "mop_dictionary.h"

//index [0] == name / [1] == hp / [2] == attack / [3] == defense / [4] == speed

Monster goblin(void) {
    Monster goblin = { "고블린",50,5,3,15 };
    return goblin;
}

Monster slime(void) {
    Monster slime = { "슬라임",30,0,5,3 };
    return slime;
}

Monster bat(void) {
    Monster bat = { "박쥐",25,8,0,30 };
    return bat;
}

Monster oak(void) {
    Monster oak = { "오크",175,10,15,5 };
    return oak;
}

Monster wolfman(void) {
    Monster wolfman = { "늑대인간",150,10,13,20 };
    return wolfman;
}

Monster magician(void) {
    Monster magician = { "흑마술사",90,0,3,1 };
    return magician;
}

Monster dragon(void) {
    Monster dragon = { "드래곤",300,15,30,30 };
}