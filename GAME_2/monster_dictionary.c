#include "superclass.h"
#include "mop_dictionary.h"

//index [0] == name / [1] == hp / [2] == attack / [3] == defense / [4] == speed / [5] == type

Monster goblin(void) {
	Monster goblin = { "고블린",50,5,3,15,"Mop" };
    return goblin;
}

long long goblin_skill_1(char id[], Monster m[], int stage_turn, int x, int y) {
	long long damage;
    memset(string, 0, sizeof(string));
	if (!Avoidance(id, m, stage_turn, x, y)) {
		return -9999;
	}
	else {
		damage = 3;
		sprintf(string, "고블린의 일격! 피해를 %lld 받았다", damage);
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		resetColor();
		return damage;
	}
}

Monster slime(void) {
	Monster slime = { "슬라임",30,0,5,3,"Mop" };
    return slime;
}

void slime_skill_1(void) {
	memset(string, 0, sizeof(string));
	strcat(string, "슬라임의 필살 흐물거리기! 하지만 아무일도 일어나지 않았다!");
	scrollUpImproved(32, 3, 17);
	setRGBColor(0, 255, 0);
	printAt(32, 17, string);
	gotoxy(32 + strlen(string), 17);
	resetColor();
	return;
}

Monster bat(void) {
	Monster bat = { "박쥐",25,8,0,30,"Mop" };
    return bat;
}

long long bat_skill_1(char id[], Monster m[], int stage_turn, int x, int y) {
	if (!Avoidance(id, m, stage_turn, x, y)) {
		return -9999;
	}
	else {
		memset(string, 0, sizeof(string));
		long long damage = 5;
		strcat(string, "박쥐가 흡혈을 했다! HP를 5 뺐겼다");
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		resetColor();
		return damage;
	}
}

long long bat_skill_2(char id[], Monster m[], int stage_turn, int x, int y) {
	if (!Avoidance(id, m, stage_turn, x, y)) {
		return -9999;
	}
	else {
		memset(string, 0, sizeof(string));
		long long damage = 8;
		strcat(string, "박쥐의 할퀴기! 피해를 8 받았다");
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		return damage;
	}
}

Monster oak(void) {
	Monster oak = { "오크",175,10,15,5,"Mop" };
    return oak;
}

long long oak_skill_1(char id[], Monster m[], int stage_turn, int x, int y) {
	if (!Avoidance(id, m, stage_turn, x, y)) {
		return -9999;
	}
	else {
		memset(string, 0, sizeof(string));
		long long damage = 10;
		strcat(string, "오크의 찍어누르기! 피해를 10 받았다");
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		resetColor();
		return damage;
	}
}

Monster wolfman(void) {
	Monster wolfman = { "늑대인간",170,10,13,20,"Mop" };
    return wolfman;
}

long long wolfman_skill_1(char id[], Monster m[], int stage_turn, int x, int y) {
	if (!Avoidance(id, m, stage_turn, x, y)) {
		return -9999;
	}
	else {
		memset(string, 0, sizeof(string));
		long long damage = 10;
		strcat(string, "늑대인간의 할퀴기 공격! 피해를 10 받았다");
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		resetColor();
		return damage;
	}
}

long long wolfman_skill_2(char id[], Monster m[], int stage_turn, int x, int y) {
	if (!Avoidance(id, m, stage_turn, x, y)) {
		return -9999;
	}
	else {
		memset(string, 0, sizeof(string));
		long long damage = 13;
		strcat(string, "늑대인간에게 물어 뜯겼다! 피해를 8 받았다");
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		resetColor();
		unsigned int compare = rand() % 10;
		if (compare < 4) {
			memset(string, 0, sizeof(string));
			strcat(string, "늑대인간의 물어 뜯기에 감염되었다! 피해를 12 받았다");
			scrollUpImproved(32, 3, 17);
			setRGBColor(255, 0, 0);
			printAt(32, 17, string);
			gotoxy(32 + strlen(string), 17);
			resetColor();
			damage += 12;
		}
		return damage;
	}
}

Monster magician(void) {
    Monster magician = { "흑마'술'사",200,0,3,1,"Mop" };
    return magician;
}

long long magician_skill_1(char id[], Monster m[], int stage_turn, int x, int y) {
	if (!Avoidance(id, m, stage_turn, x, y)) {
		return -9999;
	}
	else {
		memset(string, 0, sizeof(string));
		strcat(string, "흑마술사의 모자에서 까마귀가 튀어나왔다!!");
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		resetColor();
		return 0;
	}
}


Monster dragon(void) {
    Monster dragon = { "드래곤",300,15,30,30,"Mop" };
	return dragon;
}

long long dragon_skill_1(char id[], Monster m[], int stage_turn, int x, int y) {
	if (!Avoidance(id, m, stage_turn, x, y)) {
		return -9999;
	}
	else {
		int num1 = rand() % 100;
		int num2 = rand() % 50;
		if (num2 > num1) {
			memset(string, 0, sizeof(string));
			long long damage = 15;
			strcat(string, "드래곤의 후려치기! 피해를 15 받았다");
			scrollUpImproved(32, 3, 17);
			setRGBColor(255, 0, 0);
			printAt(32, 17, string);
			gotoxy(32 + strlen(string), 17);
			resetColor();
			return damage;
		}
		else {
			memset(string, 0, sizeof(string));
			long long damage = 5;
			strcat(string, "드래곤의 불뿜기! 피해를 5 받았다:[화상(3턴):지속 피해 3]");
			scrollUpImproved(32, 3, 17);
			setRGBColor(255, 0, 0);
			printAt(32, 17, string);
			gotoxy(32 + strlen(string), 17);
			resetColor();
			return damage;
		}
	}
}

Monster Golem(void) {
	Monster golem = { "골렘", 120, 20, 50, 10, "Mop" };
	return golem;
}

long long Golem_skill_1(char id[], Monster m[], int stage_turn, int x, int y) {
	if (!Avoidance(id, m, stage_turn, x, y)) {
		return -9999;
	}
	else {
		memset(string, 0, sizeof(string));
		long long damage = 20;
		strcat(string, "골렘의 내리치기! 피해를 15 받았다");
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		resetColor();
		return damage;
	}
}

Monster Grandis(void) {
	Monster golem = { "그란디스", 1000, 60, 50, 50, "Mop" };
	return golem;
}

long long Grandis_skill_1(char id[], Monster m[], int stage_turn, int x, int y) {
	if (!Avoidance(id, m, stage_turn, x, y)) {
		return -9999;
	}
	int num = rand() % 100;
	int num2 = rand() % 20;
	if(num2>num){
		memset(string, 0, sizeof(string));
		long long damage = 50;
		strcat(string, "그란디스의 저주받은 일격! 피해를 50 받았다");
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		resetColor();
		return damage;
	}
	else {
		num = rand() % 100;
		num2 = rand() % 5;
		if (num2 > num) {
			memset(string, 0, sizeof(string));
			long long damage = 5;
			strcat(string, "그란디스의 영혼흡수! 체력을 30 뺐겼다");
			scrollUpImproved(32, 3, 17);
			setRGBColor(255, 0, 0);
			printAt(32, 17, string);
			gotoxy(32 + strlen(string), 17);
			resetColor();
			return damage;
		}
		memset(string, 0, sizeof(string));
		long long damage = 30;
		strcat(string, "그란디스의 암흑의 검! 피해를 45 받았다");
		scrollUpImproved(32, 3, 17);
		setRGBColor(255, 0, 0);
		printAt(32, 17, string);
		gotoxy(32 + strlen(string), 17);
		resetColor();
		return damage;
	}
}