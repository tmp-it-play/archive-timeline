#include <stdio.h>

int main(void){
	int year = 0,mouth = 0,day = 0;
	scanf("%d.%d.%d", &year, &mouth, &day);
	printf("%04d.%02d.%02d", year, mouth, day);
	return 0;
}
