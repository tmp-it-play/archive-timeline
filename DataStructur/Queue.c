#include "stdio.h"
#include "stdlib.h"
#define MAX_QUEUE_SIZE 100
/*
typedef int element;
typedef struct {
	element data[MAX_QUEUE_SIZE];
	int front, rear;
} QueueType;

void error(char* message) {
	fprintf(stderr, "%s\n", message);
	exit(1);
}

void init_queue(QueueType* q) {
	q->rear = -1;
	q->front = -1;
}

void queue_print(QueueType* q) {
	for (int i = 0; i < MAX_QUEUE_SIZE; i++) {
		if (i <= q->front || i > q->rear) {
			printf("   |");
		}
		else {
			printf("%d |", q->data[i]);
		}
		
	}
	printf("\n");
}

int is_full(QueueType* q) {
	if (q->rear == MAX_QUEUE_SIZE - 1) {
		return 1;
	}
	else {
		return 0;
	}
}

int is_empty(QueueType* q) {
	if (q->front == q->rear) {
		return 1;
	}
	else {
		return 0;
	}
}

void enqueue(QueueType* q, element item) {
	if (is_full(q)) {
		error("큐가 포화상태입니다.");
		return;
	}
	q->data[++(q->rear)] = item;
}

int dequeue(QueueType* q) {
	if (is_empty(q)) {
		error("큐가 공백상태입니다.");
		return -1;
	}
	int item = q->data[++(q->front)];
	return item;
}
*/
/*
int main() {
	QueueType q;
	init_queue(&q);
	enqueue(&q, 1); queue_print(&q);
	enqueue(&q, 2); queue_print(&q);
	enqueue(&q, 3); queue_print(&q);
	dequeue(&q); queue_print(&q);
	dequeue(&q); queue_print(&q);
	dequeue(&q); queue_print(&q);
	return 0;
}
*/