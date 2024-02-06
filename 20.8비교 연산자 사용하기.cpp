/*
#define _CRT_SECURE_NO_WARNINGS
#include<stdio.h>
int main()
{
    unsigned char c1 = NULL;
    scanf("%c", &c1);
    if (c1 != 'k')
        printf("참\n");
    if (c1 == 'k')
        printf("거짓\n");
    if (c1 > 104)          //104를 사용한 이유는 ASCII코드표 참고
        printf("참\n");
    if (c1 <= 104)         //작성 중에 갑자기 오류를 뿜어서 이것저것 시도해본 흔적(104 쓴거)
        printf("거짓\n");
    if (c1 <= 'o')
        printf("참\n");
    if (c1 > 'o')
        printf("거짓\n");
    return 0;
}
*/