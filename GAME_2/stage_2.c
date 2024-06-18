#include "superclass.h"

void stage_2(char id[], int mop_num) {
	Clear_Gamelog();
	static int initial_x = 32, initial_y = 17, mop_hp, mop_max_hp;
	int n = 6;
	label:;
	Monster m[15] = { goblin(), bat(), bat(), goblin(), goblin() };
}