#include <stdio.h>

int main(void){
	long long numaft = 0,numbe = 0;
	scanf("%d-%d", &numaft, &numbe);
	printf("%06d%06d", numaft, numbe);
	return 0;
}
