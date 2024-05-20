#include "superclass.h"

int main() {
    int sync = 0;
    Program_config();
    ASCII_Art_print();

    CursorView(0);
    sync = loginmenuDraw();
    while (sync == 1) {
        Program_config();
        ASCII_Art_print();
        loginmenuDraw();
    }
    exit(1);
}