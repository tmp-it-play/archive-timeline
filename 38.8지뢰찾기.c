#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main()
{
    int m, n, i, j;
    scanf("%d %d", &m, &n);
    char** matrix = malloc(sizeof(char*) * m);
    for (i = 0; i < m; i++)
    {
        matrix[i] = malloc(sizeof(char) * (n + 1));
        memset(matrix[i], 0, sizeof(char) * (n + 1));
    }
    for (i = 0; i < m; i++)
    {
        scanf("%s", matrix[i]);
    }
    for (i = 0; i < m; i++)
    {
        for (j = 0; j < n; j++)
        {
            if (matrix[i][j] == '*')
            {
                printf("%c", matrix[i][j]);
                continue;
            }
            else
            {
                matrix[i][j] = 0;
                for (int x = i - 1; x <= i + 1; x++)
                {
                    for (int y = j - 1; y <= j + 1; y++)
                    {
                        if (x < 0 || x >= n || y < 0 || y >= n)
                            continue;
                        else if (matrix[x][y] == '*')
                            matrix[i][j] += 1;
                    }

                }
                printf("%d", matrix[i][j]);
            }
        }
        printf("\n");
    }
    for (int i = 0; i < m; i++)
        free(matrix[i]);
    free(matrix);
    return 0;

}