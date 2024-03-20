#include <stdio.h>
int main() {
	int red, green, blue, total_color=0;
	int i, j, k;
	scanf("%d %d %d", &red, &green, &blue);
	for (i=0; i<red; i++) {
	    for (j=0; j<green; j++) {
	        for (k=0; k<blue; k++) {
	            printf("%d %d %d\n", i, j, k);
	            total_color++;
	        }
	    }
	}
	printf("%d", total_color);
	return 0;
}



