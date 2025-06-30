-- 빅테이터 프로젝트 초기 데이터
-- Figma 디자인에 맞는 샘플 데이터

-- 사용자 테이블 생성 (테스트용)
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    nickname VARCHAR(50),
    preferred_location VARCHAR(100),
    preferred_categories TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 즐겨찾기 테이블 생성
CREATE TABLE IF NOT EXISTS favorite_restaurants (
    favorite_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_restaurant (user_id, restaurant_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES data(data_id) ON DELETE CASCADE
);

-- 테스트 사용자 데이터
INSERT INTO users (username, password, email, nickname, preferred_location, preferred_categories) VALUES 
('testuser', 'password123', 'test@example.com', '테스트유저', '광주 광산구', '["한식", "치킨", "피자"]'),
('minsol', 'password123', 'minsol@example.com', '민솔', '광주 광산구 소촌동', '["일식", "카페", "디저트"]'),
('bigdata', 'password123', 'bigdata@example.com', '빅데이터', '광주 광산구 송정동', '["중식", "양식", "아시안"]')
ON DUPLICATE KEY UPDATE username = username;

-- 샘플 맛집 데이터 (Figma 디자인에서 보이는 맛집들)
-- 데이터 테이블에 샘플 맛집 추가 (실제 데이터가 없을 경우를 대비)
INSERT IGNORE INTO data (data_id, service_id, org_code, manage_code, biz_name, permit_no, road_addr, jibun_addr, apply_date, designate_date, food_type, main_food, last_update_date, phone_num, naver_rating) VALUES 
(100001, 'BIGDATA', '290000', 'SAMPLE001', '짬뽕관 광주송정선운점', 'P001', '광주광역시 광산구 소촌동 123-45', '광주광역시 광산구 소촌동 123-45', '2023-01-01', '2023-01-01', '중식', '짬뽕', '2024-12-01 00:00:00', '062-123-4567', 4.9),
(100002, 'BIGDATA', '290000', 'SAMPLE002', '송정떡갈비1호점', 'P002', '광주광역시 광산구 송정동 567-89', '광주광역시 광산구 송정동 567-89', '2023-01-01', '2023-01-01', '한식', '떡갈비', '2024-12-01 00:00:00', '062-234-5678', 5.0),
(100003, 'BIGDATA', '290000', 'SAMPLE003', '카페 드롭탑', 'P003', '광주광역시 광산구 월곡동 234-56', '광주광역시 광산구 월곡동 234-56', '2023-01-01', '2023-01-01', '기타', '카페', '2024-12-01 00:00:00', '062-345-6789', 4.7),
(100004, 'BIGDATA', '290000', 'SAMPLE004', '피자스쿨 송정점', 'P004', '광주광역시 광산구 송정동 345-67', '광주광역시 광산구 송정동 345-67', '2023-01-01', '2023-01-01', '양식', '피자', '2024-12-01 00:00:00', '062-456-7890', 4.5),
(100005, 'BIGDATA', '290000', 'SAMPLE005', '맥도날드 광산점', 'P005', '광주광역시 광산구 월곡동 456-78', '광주광역시 광산구 월곡동 456-78', '2023-01-01', '2023-01-01', '양식', '햄버거', '2024-12-01 00:00:00', '062-567-8901', 4.2),
(100006, 'BIGDATA', '290000', 'SAMPLE006', '교촌치킨 송정점', 'P006', '광주광역시 광산구 송정동 567-89', '광주광역시 광산구 송정동 567-89', '2023-01-01', '2023-01-01', '기타', '치킨', '2024-12-01 00:00:00', '062-678-9012', 4.6),
(100007, 'BIGDATA', '290000', 'SAMPLE007', '스시로 광주점', 'P007', '광주광역시 광산구 월곡동 678-90', '광주광역시 광산구 월곡동 678-90', '2023-01-01', '2023-01-01', '일식', '초밥', '2024-12-01 00:00:00', '062-789-0123', 4.8),
(100008, 'BIGDATA', '290000', 'SAMPLE008', '서브웨이 광산점', 'P008', '광주광역시 광산구 소촌동 789-01', '광주광역시 광산구 소촌동 789-01', '2023-01-01', '2023-01-01', '양식', '샌드위치', '2024-12-01 00:00:00', '062-890-1234', 4.4),
(100009, 'BIGDATA', '290000', 'SAMPLE009', '샐러디 광주점', 'P009', '광주광역시 광산구 월곡동 890-12', '광주광역시 광산구 월곡동 890-12', '2023-01-01', '2023-01-01', '기타', '샐러드', '2024-12-01 00:00:00', '062-901-2345', 4.3),
(100010, 'BIGDATA', '290000', 'SAMPLE010', '파리바게뜨 송정점', 'P010', '광주광역시 광산구 송정동 901-23', '광주광역시 광산구 송정동 901-23', '2023-01-01', '2023-01-01', '기타', '빵', '2024-12-01 00:00:00', '062-012-3456', 4.1);

-- 테스트 즐겨찾기 데이터
INSERT IGNORE INTO favorite_restaurants (user_id, restaurant_id) VALUES 
(1, 100001), -- testuser가 짬뽕관을 즐겨찾기
(1, 100002), -- testuser가 송정떡갈비를 즐겨찾기
(2, 100003), -- minsol이 카페 드롭탑을 즐겨찾기
(2, 100007), -- minsol이 스시로를 즐겨찾기
(3, 100004), -- bigdata가 피자스쿨을 즐겨찾기
(3, 100006); -- bigdata가 교촌치킨을 즐겨찾기
