#include <stdio.h>

int main(void){
char d[21]; 
short i;
scanf("%s", d); 
for(i = 0; d[i]!='\0'; i++)
   printf("\'%c\'\n", d[i]);
return 0;
}
