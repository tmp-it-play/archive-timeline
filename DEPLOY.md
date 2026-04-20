# GOGO 온프레미스 배포 가이드

## 전체 구조

```
총 서버 4대 — 각 서버는 도메인 제공, 포트 3개 사용 가능 (22 · 80 · 추가1개)

┌─────────────────────────────────────────────────────────────────┐
│  인프라 서버  (infra.example.com)                                  │
│                                                                 │
│  :22   → SSH                                                    │
│  :80   → Nginx → Grafana(3000) / Eureka(8761) path 라우팅        │
│  :추가  → 용도 자유 (예: 직접 모니터링 접근)                          │
│                                                                 │
│  내부: MySQL(3306) · Redis(6379) · Kafka(9092)                  │
│        Eureka(8761) · Config Server(8888) · Loki(3100)          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  서버 A               │  │  서버 B               │  │  서버 C               │
│  server-a.example.com│  │  server-b.example.com│  │  server-c.example.com│
│                      │  │                      │  │                      │
│  :22  → SSH          │  │  :22  → SSH          │  │  :22  → SSH          │
│  :80  → Nginx        │  │  :80  → Nginx        │  │  :80  → Nginx        │
│    /api/user/ →:8081 │  │    /api/stage/ →:8082│  │    /api/sp/   →:8085 │
│    /api/shop/ →:8084 │  │    /api/bet/   →:8083│  │    /api/mini/ →:8086 │
│  :추가 → 자유         │  │  :추가 → 자유         │  │    /ws/       →:8086 │
└──────────────────────┘  └──────────────────────┘  │  :추가 → 자유         │
                                                     └──────────────────────┘
```

> **서버 간 내부 통신**: 앱 서버 → 인프라 서버로의 MySQL(3306), Kafka(9092) 등
> 접속은 서버들 사이의 내부 네트워크에서 이루어지므로 포트 제한을 받지 않습니다.
> 외부(인터넷)에서의 접근만 3개 포트로 제한됩니다.

---

## STEP 1. 서버 공통 패키지 설치 (4대 모두)

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin git
sudo usermod -aG docker ubuntu
# 재로그인 후 docker --version 으로 확인
```

**앱 서버 3대(A, B, C)에만 추가:**

```bash
sudo apt-get install -y openjdk-17-jdk
java -version
```

---

## STEP 2. 인프라 서버 세팅

### 2-1. 코드 받기

```bash
git clone -b develop https://github.com/snowykte0426/gogo.git
cd gogo/infra
```

### 2-2. .env 파일 작성

```bash
cp .env.example .env
vi .env
```

채워야 할 항목 (총 6개):

```dotenv
INFRA_DOMAIN=제공받은_인프라서버_도메인      # 예: abc.infra.host.com
MYSQL_ROOT_PASSWORD=원하는_비밀번호
DB_PASSWORD=위와_동일한_값
GRAFANA_PASSWORD=원하는_비밀번호
GOGO_SERVER_A_DOMAIN=제공받은_서버A_도메인
GOGO_SERVER_B_DOMAIN=제공받은_서버B_도메인
GOGO_SERVER_C_DOMAIN=제공받은_서버C_도메인
```

### 2-3. Config Server 설정 파일에서 CHANGE_ME 채우기

```bash
vi infra/configs/user-service-stage.yml
```

| 파일 | 반드시 채워야 할 항목 |
|------|-------------------|
| `user-service-stage.yml` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, JWT 관련 4개 값, `serverToServerIp` |
| `stage-service-stage.yml` | `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `S3_BUCKET` |
| `shop`, `betting` | 추가 변경 사항 없음 |

> `DB_PASSWORD`는 이미 `.env`에서 자동 연동됩니다.

### 2-4. Prometheus 설정에 앱 서버 도메인 입력

```bash
vi infra/prometheus/prometheus.yml
```

`CHANGE_ME_SERVER_A_DOMAIN` 등을 실제 도메인으로 교체합니다.

### 2-5. 인프라 기동

```bash
docker compose up -d
docker compose ps   # 모두 running 확인
```

> Eureka · Config Server는 첫 실행 시 **소스 빌드로 5~10분** 소요됩니다.

| 확인 URL | 내용 |
|----------|------|
| `http://인프라도메인:8761` | Eureka 대시보드 |
| `http://인프라도메인:8888/user-service/stage` | Config 서빙 확인 |
| `http://인프라도메인:3000` | Grafana |

---

## STEP 3. Nginx 설치 및 설정 (앱 서버 A · B · C 각각)

```bash
# 코드 먼저 받기
git clone -b develop https://github.com/snowykte0426/gogo.git
cd gogo

# Nginx 설치
sudo apt-get install -y nginx

# 서버에 맞는 conf 적용
# 서버 A:
sudo cp infra/nginx/server-a.conf /etc/nginx/sites-available/gogo.conf
# 서버 B:
sudo cp infra/nginx/server-b.conf /etc/nginx/sites-available/gogo.conf
# 서버 C:
sudo cp infra/nginx/server-c.conf /etc/nginx/sites-available/gogo.conf

sudo ln -s /etc/nginx/sites-available/gogo.conf /etc/nginx/sites-enabled/gogo.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl enable nginx && sudo systemctl start nginx
```

> **Nginx location 경로 확인**: `infra/nginx/server-*.conf`의 `/api/user/` 등이
> 실제 서비스 API prefix와 다르면 해당 파일을 수정하세요.

---

## STEP 4. gogo-minigame 환경변수 파일 생성 (서버 C, 최초 1회)

```bash
# 서버 C에서 직접 실행
cp /home/ubuntu/gogo/gogo-minigame/.env.example /home/ubuntu/.env.minigame
vi /home/ubuntu/.env.minigame
```

`INFRA_DOMAIN`, `SERVER_C_DOMAIN`, `DB_PASS`, `YAVARWEE_PRIVATE_KEY` 4개를 채웁니다.

---

## STEP 5. GitHub Secrets 등록

레포 → **Settings → Secrets and variables → Actions**

| Secret | 값 |
|--------|----|
| `INFRA_DOMAIN` | 인프라 서버 도메인 |
| `INFRA_ONPRE_DOMAIN` | 인프라 서버 도메인 (CD 접속용) |
| `INFRA_ONPRE_PASSWORD` | 인프라 서버 SSH 비밀번호 |
| `APP_SERVER_A_DOMAIN` | 서버 A 도메인 |
| `APP_SERVER_A_PASSWORD` | 서버 A SSH 비밀번호 |
| `APP_SERVER_B_DOMAIN` | 서버 B 도메인 |
| `APP_SERVER_B_PASSWORD` | 서버 B SSH 비밀번호 |
| `APP_SERVER_C_DOMAIN` | 서버 C 도메인 |
| `APP_SERVER_C_PASSWORD` | 서버 C SSH 비밀번호 |
| `DB_PASSWORD` | MySQL 비밀번호 (`.env`의 값과 동일) |
| `DISCORD_WEBHOOK` | 디스코드 웹훅 URL |

---

## STEP 6. 첫 배포

Actions 탭 → 각 워크플로우 → **Run workflow**

```
[1] 인프라 서버 docker compose 정상 기동 확인
      ↓
[2] cd-gogo-user  + cd-gogo-stage   (Eureka 등록 확인)
      ↓
[3] cd-gogo-shop  + cd-gogo-betting + cd-gogo-sp
      ↓
[4] cd-gogo-minigame
```

Eureka `http://인프라도메인:8761` 에서 6개 서비스 모두 등록되면 완료입니다.

---

## 이후 자동 배포

```
gogo-user/ 코드 수정 → develop push
  → cd-gogo-user 실행 → 서버 A에 자동 재배포 → 디스코드 알림
```

변경된 서비스만 트리거됩니다.

---

## 문제 해결

| 증상              | 확인 방법                                        |
|-----------------|----------------------------------------------|
| Eureka 미등록      | `docker logs gogo-user-stage`                |
| Config 연결 실패    | `curl http://인프라도메인:8888/user-service/stage` |
| Nginx 502       | `docker ps` 로 컨테이너 상태 확인                     |
| Kafka 연결 실패     | `infra/.env`의 `INFRA_DOMAIN` 값 확인            |
| 서버 A에서 동시 배포 충돌 | Actions에서 user/shop CD가 동시 실행 중인지 확인         |
