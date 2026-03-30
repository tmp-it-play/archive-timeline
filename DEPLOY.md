# GOGO 온프레미스 배포 가이드

## 전체 구조

```
총 서버 4대

┌─────────────────────────────────────────────────────────────┐
│  인프라 서버                                                   │
│  MySQL · Redis · Kafka · Zookeeper                          │
│  Eureka · Config Server · Prometheus · Grafana · Loki       │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  서버 A           │  │  서버 B           │  │  서버 C           │
│                  │  │                  │  │                  │
│  Nginx :80       │  │  Nginx :80       │  │  Nginx :80       │
│  ├ /api/user/    │  │  ├ /api/stage/   │  │  ├ /api/sp/      │
│  │  → :8081      │  │  │  → :8082      │  │  │  → :8085      │
│  └ /api/shop/    │  │  └ /api/betting/ │  │  ├ /api/minigame/│
│     → :8084      │  │     → :8083      │  │  │  → :8086      │
└──────────────────┘  └──────────────────┘  │  └ /ws/          │
                                             │     → :8086      │
                                             └──────────────────┘
```

> **추가 개방 포트**: 서버당 포트 1개가 더 열려 있습니다.
> 모니터링 대시보드(Grafana :3000) 또는 Eureka 대시보드(:8761) 접근 등 원하는 용도로 사용하세요.

---

## STEP 1. 서버 공통 패키지 설치

**4대 모두** SSH 접속 후 실행합니다.

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin git
sudo usermod -aG docker ubuntu
# 재로그인 필요
```

**앱 서버 3대(A, B, C)에만 추가로** Java 17 설치:

```bash
sudo apt-get install -y openjdk-17-jdk
java -version  # 확인
```

---

## STEP 2. 인프라 서버 세팅

### 2-1. 코드 받기

```bash
git clone -b develop https://github.com/snowykte0426/gogo.git
cd gogo/infra
```

### 2-2. 환경변수 파일 작성

```bash
cp .env.example .env
vi .env
```

```dotenv
# 이 서버(인프라 서버) 자신의 외부 IP
INFRA_HOST=111.111.111.10
KAFKA_ADVERTISED_HOST=111.111.111.10

# MySQL root 비밀번호
MYSQL_ROOT_PASSWORD=강한비밀번호123!

# Grafana 로그인
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin123!

# 앱 서버 IP (Prometheus 수집용)
GOGO_USER_HOST=111.111.111.11       # 서버 A IP
GOGO_STAGE_HOST=111.111.111.12      # 서버 B IP
GOGO_BETTING_HOST=111.111.111.12    # 서버 B IP
GOGO_SHOP_HOST=111.111.111.11       # 서버 A IP
GOGO_SP_HOST=111.111.111.13         # 서버 C IP
GOGO_MINIGAME_HOST=111.111.111.13   # 서버 C IP
```

### 2-3. Config Server 설정 파일 채우기

`infra/configs/` 안의 파일 4개를 열어 `CHANGE_ME` 부분을 실제 값으로 바꿉니다.

```bash
vi infra/configs/user-service-stage.yml
```

| 파일 | 수정 항목 |
|------|----------|
| `user-service-stage.yml` | `DB_PASSWORD`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| `shop-service-stage.yml` | `DB_PASSWORD` |
| `betting-service-stage.yml` | `DB_PASSWORD` |
| `stage-service-stage.yml` | `DB_PASSWORD`, `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `S3_BUCKET` |

모든 파일에서 `DB_PASSWORD`는 `MYSQL_ROOT_PASSWORD`와 동일하게 설정합니다.

### 2-4. Prometheus 설정에 앱 서버 IP 직접 입력

```bash
vi infra/prometheus/prometheus.yml
```

`${GOGO_USER_HOST}` 등의 플레이스홀더를 실제 IP로 교체합니다.

```yaml
# 수정 전
- targets: ['${GOGO_USER_HOST}:8081']
# 수정 후
- targets: ['111.111.111.11:8081']
```

### 2-5. 인프라 전체 기동

```bash
docker compose up -d
```

```bash
# 상태 확인 (모두 running이어야 함)
docker compose ps
```

> Eureka·Config Server는 소스 빌드가 필요해 **처음 기동 시 5~10분** 걸립니다.

| URL | 역할 |
|-----|------|
| `http://인프라IP:8761` | Eureka 대시보드 |
| `http://인프라IP:8888/user-service/stage` | Config Server 확인 |
| `http://인프라IP:3000` | Grafana |

---

## STEP 3. Nginx 설치 및 설정 (앱 서버 A·B·C 각각)

### 3-1. Nginx 설치

```bash
sudo apt-get install -y nginx
```

### 3-2. 설정 파일 복사

각 서버에 맞는 conf 파일을 사용합니다.

```bash
# 서버 A에서
sudo cp /home/ubuntu/gogo/infra/nginx/server-a.conf /etc/nginx/sites-available/gogo.conf

# 서버 B에서
sudo cp /home/ubuntu/gogo/infra/nginx/server-b.conf /etc/nginx/sites-available/gogo.conf

# 서버 C에서
sudo cp /home/ubuntu/gogo/infra/nginx/server-c.conf /etc/nginx/sites-available/gogo.conf
```

### 3-3. 활성화 및 기동

```bash
sudo ln -s /etc/nginx/sites-available/gogo.conf /etc/nginx/sites-enabled/gogo.conf
sudo rm -f /etc/nginx/sites-enabled/default   # 기존 default 제거
sudo nginx -t                                  # 문법 검사
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3-4. Nginx conf 파일의 location 경로 확인 (중요)

현재 Nginx 설정은 아래 경로 기준으로 라우팅합니다.
실제 서비스의 API 경로 prefix와 다르다면 수정이 필요합니다.

| 서버 | Nginx location | 실제 앱 포트 |
|------|---------------|------------|
| A | `/api/user/` | 8081 |
| A | `/api/shop/` | 8084 |
| B | `/api/stage/` | 8082 |
| B | `/api/betting/` | 8083 |
| C | `/api/sp/` | 8085 |
| C | `/api/minigame/` | 8086 |
| C | `/ws/` | 8086 (WebSocket) |

예) gogo-user의 실제 API가 `/user/` 로 시작한다면:
```nginx
# infra/nginx/server-a.conf 수정
location /user/ {
    proxy_pass http://gogo-user/user/;
    ...
}
```

---

## STEP 4. GitHub Secrets 등록

레포 → **Settings → Secrets and variables → Actions**

### 서버별

| Secret | 값 |
|--------|----|
| `APP_SERVER_A_HOST` | 서버 A IP |
| `APP_SERVER_A_PASSWORD` | 서버 A SSH 비밀번호 |
| `APP_SERVER_B_HOST` | 서버 B IP |
| `APP_SERVER_B_PASSWORD` | 서버 B SSH 비밀번호 |
| `APP_SERVER_C_HOST` | 서버 C IP |
| `APP_SERVER_C_PASSWORD` | 서버 C SSH 비밀번호 |
| `INFRA_ONPRE_HOST` | 인프라 서버 IP |
| `INFRA_ONPRE_PASSWORD` | 인프라 서버 SSH 비밀번호 |

### 공통

| Secret | 값 |
|--------|----|
| `INFRA_HOST` | 인프라 서버 IP (앱 컨테이너가 참조) |
| `DB_USER` | `root` (gogo-sp 전용) |
| `DB_PASSWORD` | MySQL 비밀번호 (gogo-sp 전용) |
| `DISCORD_WEBHOOK` | 디스코드 웹훅 URL |

---

## STEP 5. gogo-minigame .env 파일 생성

gogo-minigame 서버(서버 C)에서 직접 생성합니다.
CD로 자동 배포되지 않으므로 **최초 1회** 수동으로 만들어야 합니다.

```bash
mkdir -p /home/ubuntu/gogo/gogo-minigame
vi /home/ubuntu/gogo/gogo-minigame/.env
```

```dotenv
DB_HOST=인프라서버IP
DB_PORT=3306
DB_NAME=gogo-minigame
DB_USER=root
DB_PASS=MySQL비밀번호

EUREKA_HOST=인프라서버IP
EUREKA_PORT=8761
EUREKA_SERVICE_NAME=gogo-minigame
INSTANCE_IP=서버C_IP
INSTANCE_HOST=서버C_IP
INSTANCE_PORT=8086

KAFKA_HOST=인프라서버IP
KAFKA_PORT=9092

YAVARWEE_PRIVATE_KEY=암호화키값

LOKI_ENDPOINT=http://인프라서버IP:3100/loki/api/v1/push
```

---

## STEP 6. 첫 배포

GitHub Actions → Actions 탭 → 각 워크플로우 → **Run workflow**

### 배포 순서

```
[1] 인프라 서버 docker compose 정상 기동 확인
      ↓
[2] cd-gogo-user    (서버 A, Eureka 등록 확인)
    cd-gogo-stage   (서버 B, Eureka 등록 확인)
      ↓
[3] cd-gogo-shop    (서버 A)
    cd-gogo-betting (서버 B)
    cd-gogo-sp      (서버 C)
      ↓
[4] cd-gogo-minigame (서버 C)
```

배포 후 Eureka(`http://인프라IP:8761`)에서 6개 서비스 모두 등록되는지 확인합니다.

---

## STEP 7. 이후 자동 배포

`develop` 브랜치에 push하면 변경된 서비스만 자동 배포됩니다.

```
gogo-user/ 수정 → push → cd-gogo-user 실행 → 서버 A에 재배포
gogo-shop/ 수정 → push → cd-gogo-shop  실행 → 서버 A에 재배포
gogo-stage/수정 → push → cd-gogo-stage 실행 → 서버 B에 재배포
...
infra/ 수정     → push → cd-infra       실행 → 인프라 서버에서 docker compose up
```

---

## 문제 해결

### 서비스가 Eureka에 등록 안 됨

```bash
# 컨테이너 로그 확인
docker logs gogo-user-stage

# Config Server에서 설정을 받는지 확인
curl http://인프라IP:8888/user-service/stage
```

### Nginx 502 Bad Gateway

서비스 컨테이너가 아직 시작 중이거나 죽어 있는 상태입니다.

```bash
docker ps                          # 컨테이너 상태 확인
docker logs gogo-user-stage --tail 30
```

### Kafka 연결 실패

`infra/.env`의 `KAFKA_ADVERTISED_HOST`가 인프라 서버의 **외부 IP** 인지 확인합니다.
`localhost`나 내부 IP로 되어 있으면 외부 앱 서버에서 접근이 불가합니다.

### gogo-stage/gogo-shop CD가 동시에 실행될 때 서버 충돌

같은 서버(A 또는 B)에 두 서비스가 동시에 배포되면 `./gradlew` 빌드가 충돌할 수 있습니다.
GitHub Actions에서 두 workflow를 동시에 실행하지 않도록 `concurrency` 설정을 추가할 수 있습니다.

```yaml
# workflow 파일 상단에 추가
concurrency:
  group: server-a-deploy
  cancel-in-progress: false
```

---

## 포트 요약

| 서비스 | 서버 | 내부 포트 | 외부 접근 |
|--------|------|----------|----------|
| gogo-user | 서버 A | 8081 | Nginx `/api/user/` |
| gogo-shop | 서버 A | 8084 | Nginx `/api/shop/` |
| gogo-stage | 서버 B | 8082 | Nginx `/api/stage/` |
| gogo-betting | 서버 B | 8083 | Nginx `/api/betting/` |
| gogo-sp | 서버 C | 8085 | Nginx `/api/sp/` |
| gogo-minigame | 서버 C | 8086 | Nginx `/api/minigame/`, `/ws/` |
| MySQL | 인프라 | 3306 | 내부 전용 |
| Redis | 인프라 | 6379 | 내부 전용 |
| Kafka | 인프라 | 9092 | 앱 서버에서 접근 |
| Eureka | 인프라 | 8761 | 추가 포트 개방 시 접근 가능 |
| Grafana | 인프라 | 3000 | 추가 포트 개방 시 접근 가능 |
