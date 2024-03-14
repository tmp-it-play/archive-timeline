#include <stdio.h>

int main(){
	double n1 = 0, n2 = 0, n3 = 0, temp = 0;
	double average = 0;
	scanf("%lf %lf %lf", &n1, &n2, &n3);
	printf("%.0lf\n", n1 + n2 + n3);
	temp = n1 + n2 + n3;
	average = temp / 3;
	printf("%.1lf", average);
}
