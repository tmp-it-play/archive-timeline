#include "stdio.h"
#define STACK_SIZE 5
typedef int element;
element stack[STACK_SIZE];
int top = -1;

void push(element item) {
	if (top >= STACK_SIZE - 1) {
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
/*
void main() {
	push(1);
	push(2);
	push(3);
	int temp = peek();
	printf("%d\n", temp);
	printf("%d\n", pop());
	temp = peek();
	printf("%d\n", temp);
	printf("%d\n", pop());
	printf("%d\n", pop());
	printf("%d\n", pop());
}
*/