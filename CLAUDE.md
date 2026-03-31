# CLAUDE.md — gogo Project Operations Guide

## SSH Access (using sshpass)

All servers are accessible via port forwarding through `gsmsv-1.yujun.kr`.

```bash
# Infra Server (port 27108)
sshpass -p 'A5CPpFW%' ssh -o StrictHostKeyChecking=no -p 27108 ubuntu@gsmsv-1.yujun.kr

# Server A (port 27107)
sshpass -p '!V%B$et2' ssh -o StrictHostKeyChecking=no -p 27107 ubuntu@gsmsv-1.yujun.kr

# Server B (port 27109)
sshpass -p 'Fj&6%4@$' ssh -o StrictHostKeyChecking=no -p 27109 ubuntu@gsmsv-1.yujun.kr

# Server C (port 27110)
sshpass -p '88J@V%Wj' ssh -o StrictHostKeyChecking=no -p 27110 ubuntu@gsmsv-1.yujun.kr
```

### Port Convention

| Purpose    | Offset | Example (Server A) |
|------------|--------|--------------------|
| SSH        | base   | 27107              |
| HTTP (80)  | +1000  | 28107              |
| Direct app | +2000  | 29107 (unused)     |

---

## Instance Overview

### Infra Server — SSH 27108

**Internal IP:** `10.0.0.131`

| Container       | Port | Description                |
|-----------------|------|----------------------------|
| gogo-mysql      | 3306 | MySQL 8.0 (all databases)  |
| gogo-redis      | 6379 | Redis cache                |
| gogo-zookeeper  | 2181 | Kafka coordinator          |
| gogo-kafka      | 9092 | Kafka broker               |
| gogo-eureka     | 8761 | Service discovery          |
| gogo-config     | 8888 | Spring Cloud Config Server |
| gogo-prometheus | 9090 | Metrics collection         |
| gogo-grafana    | 3000 | Monitoring dashboard       |
| gogo-loki       | 3100 | Log aggregation            |

**Usage examples:**
```bash
# Connect to MySQL inside container
docker exec gogo-mysql mysql -uroot -p<DB_PASSWORD> <database>

# Available databases: gogo-user, gogo-shop, gogo-sp, gogo-betting, gogo-stage, gogo-minigame
```

---

### Server A — SSH 27107

**Internal IP:** `10.0.0.130`

| Service | App Port | Description |
|---------|----------|-------------|
| gogo-user-stage | 8081 | User service |
| gogo-shop-stage | 8084 | Shop service |
| gogo-promtail | — | Log shipping to Loki |

---

### Server B — SSH 27109

**Internal IP:** `10.0.0.132`

| Service            | App Port | Description          |
|--------------------|----------|----------------------|
| gogo-stage-stage   | 8082     | Stage service        |
| gogo-betting-stage | 8083     | Betting service      |
| gogo-promtail      | —        | Log shipping to Loki |

---

### Server C — SSH 27110

**Internal IP:** `10.0.0.133`

| Service             | App Port | Description          |
|---------------------|----------|----------------------|
| gogo-sp-stage       | 8085     | SP service           |
| gogo-minigame-stage | 8086     | Minigame service     |
| gogo-promtail       | —        | Log shipping to Loki |

---

## SCP File Upload

```bash
# Upload a file to the infra server
sshpass -p 'A5CPpFW%' scp -o StrictHostKeyChecking=no -P 27108 <local-file> ubuntu@gsmsv-1.yujun.kr:<remote-path>

# Example: upload a config file
sshpass -p 'A5CPpFW%' scp -o StrictHostKeyChecking=no -P 27108 infra/configs/<file>.yml ubuntu@gsmsv-1.yujun.kr:/home/ubuntu/gogo/infra/configs/
```

---

## External Access URLs

| Service     | URL                                                              |
|-------------|------------------------------------------------------------------|
| API Gateway | `http://gsmsv-1.yujun.kr:28108`                                  |
| Grafana     | `http://gsmsv-1.yujun.kr:28108/grafana/` (admin / GogoGraf2025!) |
| Prometheus  | Inside infra server — `http://localhost:9090`                    |
| Loki        | Inside infra server — `http://localhost:3100`                    |
| Eureka      | Internal — `http://10.0.0.131:8761`                              |

---

## Deployment Structure

- **CD trigger:** GitHub Actions fires on push to `develop` branch
- **Deploy flow:** SSH → git pull → gradle build → docker build/run
- **Config injection:** Loaded from Spring Cloud Config Server (`http://10.0.0.131:8888`)
- **Environment:** All containers run with `SPRING_PROFILES_ACTIVE=stage`

### CD Workflows per Service

| Service  | Workflow File        | Target Server |
|----------|----------------------|---------------|
| user     | cd-gogo-user.yml     | Server A      |
| shop     | cd-gogo-shop.yml     | Server A      |
| stage    | cd-gogo-stage.yml    | Server B      |
| betting  | cd-gogo-betting.yml  | Server B      |
| sp       | cd-gogo-sp.yml       | Server C      |
| minigame | cd-gogo-minigame.yml | Server C      |