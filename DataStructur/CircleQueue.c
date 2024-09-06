#include <stdio.h>

#define TRUE 1
#define FALSE 0
#define ERROR -1
#define MAX_SIZE 10

typedef int element;
typedef int boolean;

typedef struct {
	int rear;
	int front;
	element *data;
} circleQueue;

void init_queue(circleQueue* q) {
	q->front = 0;
	q->rear = 0;
	q->data=(element*)malloc(sizeof(element) * MAX_SIZE);
}

boolean is_empty(circleQueue* q) {
	if (q->front == q->rear) return TRUE;
	else return FALSE;
}

void enqueue(circleQueue* q, element item) {
	if (is_full(q)) {
		printf("Queue is full\n");
		return;
	}
	else {
		q->rear = (q->rear + 1) % MAX_SIZE;
		q->data[q->rear] = item; 
	}
	return;
}

element dequeue(circleQueue* q) {
	if (is_empty(q)) {
		printf("Queue is empty\n");
		return ERROR;
	}
	else {
		q->front = (q->front + 1) % MAX_SIZE;
		return q->data[q->front];
	}
}

boolean is_full(circleQueue* q) {
	if ((q->rear + 1) % MAX_SIZE == q->front) return TRUE;
	else return FALSE;
}

void queue_print(circleQueue* q) {
	for (int i = 0; i < MAX_SIZE; i++) {
		if (i <= q->front || i > q->rear) {
			printf("   |");
		}
		else {
			printf("%d |", q->data[i]);
		}
	}
	printf("\n");
}

int main(void) {
	circleQueue q;
	init_queue(&q);
	for (int i = 0; i < 5; i++) {
		enqueue(&q, i);
		queue_print(&q);
	}
	for (int i = 0; i < 5; i++) {
		dequeue(&q);
		queue_print(&q);
	}
	free(q.data);
	return 0;
}