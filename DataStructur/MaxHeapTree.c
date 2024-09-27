#include <stdio.h>
#include <stdlib.h>

// 노드 구조체 정의
struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};

// 노드 생성 함수
struct Node* createNode(int data) {
    struct Node* node = (struct Node*)malloc(sizeof(struct Node));
    node->data = data;
    node->left = NULL;
    node->right = NULL;
    return node;
}

// 최대 힙으로 변환하는 함수
void maxHeapify(struct Node* node) {
    if (node == NULL)
        return;

    // 왼쪽과 오른쪽 자식을 최대 힙으로 변환
    maxHeapify(node->left);
    maxHeapify(node->right);

    struct Node* largest = node;

    // 왼쪽 자식과 비교
    if (node->left != NULL && node->left->data > largest->data)
        largest = node->left;

    // 오른쪽 자식과 비교
    if (node->right != NULL && node->right->data > largest->data)
        largest = node->right;

    // 현재 노드가 가장 큰 값이 아니라면 교환하고 재귀적으로 호출
    if (largest != node) {
        int temp = node->data;
        node->data = largest->data;
        largest->data = temp;

        // 교환한 자식 노드에 대해 다시 힙화 진행
        maxHeapify(largest);
    }
}

// 트리를 전위 순회하여 출력하는 함수
void preorderTraversal(struct Node* node) {
    if (node == NULL)
        return;

    printf("%d ", node->data);
    preorderTraversal(node->left);
    preorderTraversal(node->right);
}

int main() {
    // 트리 생성 (예시 트리)
    /*
              23
             /   \
           56     11
          /  \    /  \
         9   56 99   27
        /
       34
    */
    struct Node* root = createNode(23);
    root->left = createNode(56);
    root->right = createNode(11);
    root->left->left = createNode(9);
    root->left->right = createNode(56);
    root->right->left = createNode(99);
    root->right->right = createNode(27);
    root->left->left->left = createNode(34);

    printf("변환 전 트리의 전위 순회 결과:\n");
    preorderTraversal(root);
    printf("\n");

    // 최대 힙으로 변환
    maxHeapify(root);

    printf("\n변환 후 트리의 전위 순회 결과:\n");
    preorderTraversal(root);
    printf("\n");

    return 0;
}
