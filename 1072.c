#include <stdio.h>

int main(void){
	int ma,num;
	scanf("%d", &ma);
	rejj:
	scanf("%d", &num);
	printf("%d\n", num);
	if(--ma != 0)
		goto rejj;
	else
		exit(0);
	return 0;
}
