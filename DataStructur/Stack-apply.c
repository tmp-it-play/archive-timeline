/*
#include "stdio.h"
#include "stdlib.h"
#define MAX_STACK_SIZE 100
#define _CRT_SECURE_NO_WARNINGS

typedef int element;
element stack[MAX_STACK_SIZE];
int top = -1;

void push(element item) {
	if (top >= MAX_STACK_SIZE - 1) {
		printf("Stack is full\n");
		return;
	}
	else stack[++top] = item;
}

element pop() {
	if (top == -1) {
		printf("Stack is empty\n");
		return 0;
	}
	else return stack[top--];
}

element peek(void) {
	if (top == -1) {
		printf("Stack is empty\n");
		return 0;
	}
	else return stack[top];
}

typedef struct {
	int data[MAX_STACK_SIZE];
	int top;
} StackType;

int eval(char exp[]) {
	int op1, op2, value, i = 0;
	int len = strlen(exp);
	char ch;
	StackType s;
	init_stack(&s);
	for (i = 0; i < len; i++) {
		ch = exp[i];
		if (ch != '+' && ch != '-' && ch != '*' && ch != '/') {
			value = ch - '0';
			push(&s, value);
		}
		else {
			op2 = pop(&s);
			op1 = pop(&s);
			switch (ch) {
			case '+': push(&s, op1 + op2); break;
			case '-': push(&s, op1 - op2); break;
			case '*': push(&s, op1 * op2); break;
			case '/': push(&s, op1 / op2); break;
			}
		}
	}
	return pop(&s);
}
*/
/*
int main() {
	int result;
	printf("수식을 입력하세요: ");
	char exp[100];
	scanf_s("%s", exp);
	result = eval(exp);
	printf("\n연산의 결과는 %d입니다.\n", result);
	return 0;
}
*/