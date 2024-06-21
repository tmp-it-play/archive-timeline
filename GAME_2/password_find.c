#include "superclass.h"

#define SMTP_SERVER "smtp.gmail.com"
#define SMTP_PORT 465
#define USER_EMAIL "dataarchlve20231130@gmail.com"
#define USER_PASSWORD "jdhp qxon mfjy ikyh"

static const char* payload_template =
"To: %s\r\n"
"From: %s\r\n"
"Subject: %s\r\n"
"Content-Type: text/html\r\n"
"\r\n"
"<html><body>"
"<h1>%s</h1>"
"<p>%s</p>"
"</body></html>\r\n";

void find_password(void) {
    while (true) {
        MYSQL db_key;
        ASCII_Art_print();
        mysql_init(&db_key);
        gotoxy(42, 15);
        printf("Password Find\n");
        if (!mysql_real_connect(&db_key, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0)) {
            gotoxy(42, 12);
            db_connect_error(&db_key);
            exit(0);
        }
        gotoxy(40, 16);
        printf("ID:");
        gotoxy(40, 18);
        printf("Email:");
        gotoxy(43, 16);
        char id[30], Email[100];
        CursorView(1);
        scanf_s(" %[^\n]", id, sizeof(char) * 30);
        gotoxy(47, 18);
        scanf_s(" %[^\n]", Email, sizeof(char) * 100);
        char query[255];
        sprintf(query, "SELECT password FROM gwangju_sword_master.account WHERE id = '%s'", id);
        if (mysql_query(&db_key, query)) {
            db_query_error(&db_key);
            exit(0);
        }
        CursorView(0);
        MYSQL_RES* result = mysql_store_result(&db_key);
        MYSQL_ROW row = mysql_fetch_row(result);
        if (row) {
            mail_send(id, Email);
            mysql_free_result(result);
            mysql_close(&db_key);
            return;
        }
        else {
            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 12);
            system("cls");
            gotoxy(42, 15);
            CursorView(0);
            printf("Password Find\n");
            gotoxy(43, 17);
            printf("아이디(ID)를 다시 확인해주세요");
            SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 15);
            Sleep(3000);
            mysql_free_result(result);
            mysql_close(&db_key);
            system("cls");
        }
        continue;
    }
}

struct upload_status {
    int lines_read;
    char payload_text[4096];
};

static size_t payload_source(void* ptr, size_t size, size_t nmemb, void* userp) {
    struct upload_status* upload_ctx = (struct upload_status*)userp;
    const char* data = upload_ctx->payload_text + upload_ctx->lines_read;
    size_t room = size * nmemb;
    if (*data) {
        size_t len = strlen(data);
        if (len > room) len = room;
        memcpy(ptr, data, len);
        upload_ctx->lines_read += len;
        return len;
    }
    return 0;
}

int mail_send(char id[], char recipient_email[]) {
    CURL* curl;
    CURLcode res = CURLE_OK;
    struct curl_slist* recipients = NULL;
    struct upload_status upload_ctx = { 0 };
    char subject[256];
    sprintf(subject, "회귀: 비밀번호 찾기(ID: %s)", id);
    const char* body_header = "비밀번호를 타인에게 노출하지 마십시오";
    char body_content[256];
    MYSQL db;
    mysql_init(&db);
    if (mysql_real_connect(&db, "localhost", "root", "123456", "gwangju_sword_master", 0, NULL, 0) == NULL) {
        db_connect_error(&db);
        exit(0);
    }
    char query[255];
    sprintf(query, "SELECT password FROM gwangju_sword_master.account WHERE id = '%s'", id);
    if (mysql_query(&db, query)) {
        db_query_error(&db);
        exit(0);
    }
    MYSQL_RES* result = mysql_store_result(&db);
    MYSQL_ROW row = mysql_fetch_row(result);
    if (row) {
        sprintf(body_content, "현재 계정의 비밀번호는 '%s' 입니다", row[0]);
    }
    else {
        mysql_free_result(result);
        mysql_close(&db);
        return -1;
    }
    snprintf(upload_ctx.payload_text, sizeof(upload_ctx.payload_text), payload_template,
        recipient_email, USER_EMAIL, subject, body_header, body_content);
    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_USERNAME, USER_EMAIL);
        curl_easy_setopt(curl, CURLOPT_PASSWORD, USER_PASSWORD);
        curl_easy_setopt(curl, CURLOPT_URL, "smtps://" SMTP_SERVER);
        curl_easy_setopt(curl, CURLOPT_MAIL_FROM, USER_EMAIL);
        recipients = curl_slist_append(recipients, recipient_email);
        curl_easy_setopt(curl, CURLOPT_MAIL_RCPT, recipients);
        curl_easy_setopt(curl, CURLOPT_READFUNCTION, payload_source);
        curl_easy_setopt(curl, CURLOPT_READDATA, &upload_ctx);
        curl_easy_setopt(curl, CURLOPT_UPLOAD, 1L);
        curl_easy_setopt(curl, CURLOPT_CAINFO, "C:\\Users\\USER\\Downloads\\cacert.pem");
        res = curl_easy_perform(curl);
        if (res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        }
        curl_slist_free_all(recipients);
        curl_easy_cleanup(curl);
    }
    curl_global_cleanup();
    mysql_free_result(result);
    mysql_close(&db);
    return (int)res;
}
