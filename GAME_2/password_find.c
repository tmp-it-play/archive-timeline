#define WIN32_LEAN_AND_MEAN
#include "winsock2.h"
#include "ws2tcpip.h"
#include "windows.h"
#include "openssl/ssl.h"
#include "openssl/err.h"

#pragma comment(lib, "ws2_32.lib")
#pragma comment(lib, "libssl.lib")
#pragma comment(lib, "libcrypto.lib")

#define SMTP_SERVER "smtp.gmail.com"
#define SMTP_PORT "587"
#define BUFFER_SIZE 1024

char* base64_encode(const unsigned char* input, int length) {
    static const char encoding_table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    static const char padding_char = '=';
    char* encoded_data;
    int output_length;
    output_length = 4 * ((length + 2) / 3);
    encoded_data = (char*)malloc(output_length + 1);
    if (encoded_data == NULL) return NULL;
    for (int i = 0, j = 0; i < length;) {
        uint32_t octet_a = i < length ? (unsigned char)input[i++] : 0;
        uint32_t octet_b = i < length ? (unsigned char)input[i++] : 0;
        uint32_t octet_c = i < length ? (unsigned char)input[i++] : 0;
        uint32_t triple = (octet_a << 0x10) + (octet_b << 0x08) + octet_c;
        encoded_data[j++] = encoding_table[(triple >> 3 * 6) & 0x3F];
        encoded_data[j++] = encoding_table[(triple >> 2 * 6) & 0x3F];
        encoded_data[j++] = encoding_table[(triple >> 1 * 6) & 0x3F];
        encoded_data[j++] = encoding_table[(triple >> 0 * 6) & 0x3F];
    }
    for (int i = 0; i < (output_length - (length % 3 ? 3 - length % 3 : 0)); i++) {
        encoded_data[output_length - 1 - i] = padding_char;
    }
    encoded_data[output_length] = '\0';
    return encoded_data;
}

void send_command(SOCKET sock, const char* cmd, const char* arg) {
    char buffer[BUFFER_SIZE];
    if (arg != NULL) {
        snprintf(buffer, sizeof(buffer), "%s %s\r\n", cmd, arg);
    }
    else {
        snprintf(buffer, sizeof(buffer), "%s\r\n", cmd);
    }
    send(sock, buffer, strlen(buffer), 0);
    int bytes_received = recv(sock, buffer, sizeof(buffer) - 1, 0);
    if (bytes_received > 0) {
        buffer[bytes_received] = '\0';
        printf("Server response: %s\n", buffer);
    }
}

void send_ssl_command(SSL* ssl, const char* cmd, const char* arg) {
    char buffer[BUFFER_SIZE];
    if (arg != NULL) {
        snprintf(buffer, sizeof(buffer), "%s %s\r\n", cmd, arg);
    }
    else {
        snprintf(buffer, sizeof(buffer), "%s\r\n", cmd);
    }
    SSL_write(ssl, buffer, strlen(buffer));
    int bytes_received = SSL_read(ssl, buffer, sizeof(buffer) - 1);
    if (bytes_received > 0) {
        buffer[bytes_received] = NULL;
        printf("Server response: %s\n", buffer);
    }
    else {
        int ssl_err = SSL_get_error(ssl, bytes_received);
        printf("SSL_read failed with error code: %d\n", ssl_err);
        ERR_print_errors_fp(stderr);
    }
}

int mail_send(void) {
    WSADATA wsa;
    SOCKET sockfd;
    struct addrinfo hints, * result, * ptr;
    SSL_CTX* ctx;
    SSL* ssl;
    char buffer[BUFFER_SIZE];
    char username[] = "dataarchlve20231130@gmail.com";
    char password[] = "jdhp qxon mfjy ikyh";
    char recipient[] = "snowykte0426@naver.com";
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        printf("WSAStartup failed. Error Code : %d\n", WSAGetLastError());
        return EXIT_FAILURE;
    }
    printf("Winsock initialized.\n");
    ZeroMemory(&hints, sizeof(hints));
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_protocol = IPPROTO_TCP;
    if (getaddrinfo(SMTP_SERVER, SMTP_PORT, &hints, &result) != 0) {
        printf("getaddrinfo failed. Error Code : %d\n", WSAGetLastError());
        WSACleanup();
        return EXIT_FAILURE;
    }
    printf("Address info obtained.\n");
    for (ptr = result; ptr != NULL; ptr = ptr->ai_next) {
        sockfd = socket(ptr->ai_family, ptr->ai_socktype, ptr->ai_protocol);
        if (sockfd == INVALID_SOCKET) {
            continue;
        }
        if (connect(sockfd, ptr->ai_addr, (int)ptr->ai_addrlen) == SOCKET_ERROR) {
            closesocket(sockfd);
            sockfd = INVALID_SOCKET;
            continue;
        }
        break;
    }
    freeaddrinfo(result);
    if (sockfd == INVALID_SOCKET) {
        printf("Unable to connect to server.\n");
        WSACleanup();
        return EXIT_FAILURE;
    }
    printf("Connected to server.\n");
    int bytes_received = recv(sockfd, buffer, sizeof(buffer) - 1, 0);
    if (bytes_received > 0) {
        buffer[bytes_received] = '\0';
        printf("Server response: %s\n", buffer);
    }
    send_command(sockfd, "HELO", "example.com");
    send_command(sockfd, "STARTTLS", NULL);
    SSL_load_error_strings();
    SSL_library_init();
    OpenSSL_add_all_algorithms();
    printf("OpenSSL initialized.\n");
    ctx = SSL_CTX_new(TLS_client_method());
    if (ctx == NULL) {
        ERR_print_errors_fp(stderr);
        closesocket(sockfd);
        WSACleanup();
        return EXIT_FAILURE;
    }
    ssl = SSL_new(ctx);
    SSL_set_fd(ssl, sockfd);
    int ret = SSL_connect(ssl);
    if (ret != 1) {
        int ssl_err = SSL_get_error(ssl, ret);
        printf("SSL_connect failed with error code: %d\n", ssl_err);
        ERR_print_errors_fp(stderr);
        SSL_free(ssl);
        SSL_CTX_free(ctx);
        closesocket(sockfd);
        WSACleanup();
        return EXIT_FAILURE;
    }
    printf("SSL connection established.\n");
    Sleep(5000);
    bytes_received = SSL_read(ssl, buffer, sizeof(buffer) - 1);
    if (bytes_received > 0) {
        buffer[bytes_received] = '\0';
        printf("Server response after SSL connection: %s\n", buffer);
    }
    else {
        int ssl_err = SSL_get_error(ssl, bytes_received);
        printf("SSL_read failed with error code: %d\n", ssl_err);
        ERR_print_errors_fp(stderr);
        return EXIT_FAILURE;
    }
    printf("Starting authentication.\n");
    send_ssl_command(ssl, "AUTH LOGIN", NULL);
    char* base64_username = base64_encode((const unsigned char*)username, strlen(username));
    char* base64_password = base64_encode((const unsigned char*)password, strlen(password));
    printf("Sending username.\n");
    send_ssl_command(ssl, base64_username, NULL);
    printf("Sending password.\n");
    send_ssl_command(ssl, base64_password, NULL);
    free(base64_username);
    free(base64_password);
    send_ssl_command(ssl, "MAIL FROM:", username);
    send_ssl_command(ssl, "RCPT TO:", recipient);
    send_ssl_command(ssl, "DATA", NULL);
    printf("Sending email body.\n");
        SSL_write(ssl, "Subject: Test Email\r\n", strlen("Subject: Test Email\r\n"));
    SSL_write(ssl, "MIME-Version: 1.0\r\n", strlen("MIME-Version: 1.0\r\n"));
    SSL_write(ssl, "Content-Type: text/plain; charset=\"UTF-8\"\r\n", strlen("Content-Type: text/plain; charset=\"UTF-8\"\r\n"));
    SSL_write(ssl, "\r\n", strlen("\r\n"));
    SSL_write(ssl, "This is a test email sent from C program.\r\n", strlen("This is a test email sent from C program.\r\n"));
    SSL_write(ssl, ".\r\n", strlen(".\r\n"));
    bytes_received = SSL_read(ssl, buffer, sizeof(buffer) - 1);
    if (bytes_received > 0) {
        buffer[bytes_received] = '\0';
        printf("Server response: %s\n", buffer);
    }
    else {
        int ssl_err = SSL_get_error(ssl, bytes_received);
        printf("SSL_read failed with error code: %d\n", ssl_err);
        ERR_print_errors_fp(stderr);
    }
    send_ssl_command(ssl, "QUIT", NULL);
    printf("Cleaning up.\n");
    SSL_free(ssl);
    SSL_CTX_free(ctx);
    closesocket(sockfd);
    WSACleanup();
    return 0;
}
