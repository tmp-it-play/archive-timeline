#include "superclass.h"
#include "mop_dictionary.h"

//index [0] == name / [1] == hp / [2] == attack / [3] == defense / [4] == speed

Monster goblin(void) {
    Monster goblin = { "고블린",50,5,3,15 };
    return goblin;
}

long long goblin_skill_1(void) {
	long long damage;
    memset(string, 0, sizeof(string));
	damage = 3;
    sprintf(string, "고블린의 일격! 피해를 %lld 받았다", damage);
    scrollUpImproved(32, 3, 17);
    printAt(32, 17, string);
    gotoxy(32 + strlen(string), 17);
	return damage;
}

Monster slime(void) {
    Monster slime = { "슬라임",30,0,5,3 };
    return slime;
}

void slime_skill_1(void) {
	memset(string, 0, sizeof(string));
	strcat(string, "슬라임의 필살 흐물거리기! 하지만 아무일도 일어나지 않았다!");
	scrollUpImproved(32, 3, 17);
	printAt(32, 17, string);
	gotoxy(32 + strlen(string), 17);
	return;
}

Monster bat(void) {
    Monster bat = { "박쥐",25,8,0,30 };
    return bat;
}

long long bat_skill_1(void) {
	memset(string, 0, sizeof(string));
	long long damage = 5;
	strcat(string, "박쥐가 흡혈을 했다! HP를 5 뺐겼다");
	scrollUpImproved(32, 3, 17);
	printAt(32, 17, string);
	gotoxy(32 + strlen(string), 17);
	return damage;
}

long long bat_skill_2(void) {
    memset(string, 0, sizeof(string));
	long long damage = 8;
	strcat(string, "박쥐의 할퀴기! 피해를 8 받았다");
	scrollUpImproved(32, 3, 17);
	printAt(32, 17, string);
	gotoxy(32 + strlen(string), 17);
	return damage;
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