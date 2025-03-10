CREATE TABLE event_store
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    aggregate_id VARCHAR(255) NOT NULL,
    event_type   VARCHAR(255) NOT NULL,
    payload      JSON         NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);