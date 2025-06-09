#!/bin/bash

# 환경변수 로드 및 서버 실행 스크립트

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 현재 디렉토리 저장
PROJECT_ROOT=$(pwd)

echo -e "${BLUE}🚀 Minsole BigData Server 시작${NC}"
echo -e "${BLUE}📍 프로젝트 경로: $PROJECT_ROOT${NC}"

# .env 파일 확인
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env 파일이 없습니다. .env.example을 복사합니다...${NC}"
    cp .env.example .env
    echo -e "${RED}❌ .env 파일을 수정하고 다시 실행해주세요!${NC}"
    exit 1
fi

# .env 파일에서 환경변수 로드 (macOS zsh 호환)
echo -e "${GREEN}📋 환경변수 로드 중...${NC}"
if [ -f ".env" ]; then
    while IFS='=' read -r key value; do
        # 주석과 빈 줄 건너뛰기
        if [[ ! "$key" =~ ^# ]] && [[ -n "$key" ]]; then
            # 값에서 따옴표 제거
            value=$(echo "$value" | sed 's/^"//;s/"$//')
            export "$key"="$value"
        fi
    done < .env
fi

# 필수 환경변수 체크
check_env_var() {
    local var_name=$1
    local var_value
    
    # 환경변수 값 가져오기
    eval "var_value=\$$var_name"
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}❌ $var_name이 설정되지 않았습니다${NC}"
        return 1
    else
        # 값 마스킹 (처음 10자만 표시)
        local masked_value="${var_value:0:10}..."
        echo -e "${GREEN}✅ $var_name: ${masked_value}${NC}"
        return 0
    fi
}

echo -e "${BLUE}🔍 필수 환경변수 확인 중...${NC}"
ENV_OK=true

check_env_var "NAVER_CLIENT_ID" || ENV_OK=false
check_env_var "NAVER_CLIENT_SECRET" || ENV_OK=false
check_env_var "RDB_HOST" || ENV_OK=false
check_env_var "RDB_PASSWORD" || ENV_OK=false

if [ "$ENV_OK" = false ]; then
    echo -e "${RED}❌ 필수 환경변수가 설정되지 않았습니다. .env 파일을 확인해주세요!${NC}"
    exit 1
fi

# Gradlew 파일 확인 및 권한 설정
echo -e "${BLUE}🔨 Gradle 환경 확인 중...${NC}"
if [ ! -f "$PROJECT_ROOT/gradlew" ]; then
    echo -e "${RED}❌ gradlew 파일이 없습니다${NC}"
    exit 1
fi

# gradlew 실행 권한 부여
chmod +x "$PROJECT_ROOT/gradlew"
echo -e "${GREEN}✅ gradlew 권한 설정 완료${NC}"

# Python 환경 확인
echo -e "${BLUE}🐍 Python 환경 확인 중...${NC}"
PYTHON_CMD=""

# Python 명령어 찾기
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo -e "${RED}❌ Python이 설치되지 않았습니다${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python 명령어: $PYTHON_CMD${NC}"

# pip 명령어 찾기
PIP_CMD=""
if command -v pip3 &> /dev/null; then
    PIP_CMD="pip3"
elif command -v pip &> /dev/null; then
    PIP_CMD="pip"
else
    echo -e "${RED}❌ pip이 설치되지 않았습니다${NC}"
    exit 1
fi

echo -e "${GREEN}✅ pip 명령어: $PIP_CMD${NC}"

# AI 서버 디렉토리 경로
AI_SERVER_DIR="$PROJECT_ROOT/src/main/java/com/snowykte0426/minsole/domain/search/service"

# AI 서버 디렉토리 확인
if [ ! -d "$AI_SERVER_DIR" ]; then
    echo -e "${RED}❌ AI 서버 디렉토리가 없습니다: $AI_SERVER_DIR${NC}"
    exit 1
fi

if [ ! -f "$AI_SERVER_DIR/generate.py" ]; then
    echo -e "${RED}❌ generate.py 파일이 없습니다${NC}"
    exit 1
fi

# Python AI 서버 시작
echo -e "${BLUE}🤖 AI 서버 시작 중...${NC}"

# Python 가상환경 설정
VENV_DIR="$PROJECT_ROOT/.venv"
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${YELLOW}📦 Python 가상환경 생성 중...${NC}"
    $PYTHON_CMD -m venv "$VENV_DIR"
fi

# 가상환경 활성화
if [ -f "$VENV_DIR/bin/activate" ]; then
    echo -e "${GREEN}🐍 Python 가상환경 활성화${NC}"
    source "$VENV_DIR/bin/activate"
    PIP_CMD="$VENV_DIR/bin/pip"
fi

# Python 의존성 확인 및 설치
echo -e "${BLUE}📦 Python 의존성 확인 중...${NC}"
$PYTHON_CMD -c "import fastapi, pymysql, redis, openai" 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}📦 Python 의존성 설치 중...${NC}"
    $PIP_CMD install fastapi uvicorn pymysql redis openai python-multipart
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Python 의존성 설치 실패${NC}"
        exit 1
    fi
fi

# AI 서버 시작 (백그라운드)
echo -e "${GREEN}🚀 AI 서버 시작 중...${NC}"
cd "$AI_SERVER_DIR"
$PYTHON_CMD generate.py &
AI_PID=$!

# 원래 디렉토리로 돌아가기
cd "$PROJECT_ROOT"

echo -e "${GREEN}✅ AI 서버 시작됨 (PID: $AI_PID)${NC}"

# AI 서버가 시작될 때까지 잠시 대기
echo -e "${BLUE}⏳ AI 서버 초기화 대기 중...${NC}"
sleep 3

# Spring Boot 서버 시작
echo -e "${BLUE}☕ Spring Boot 서버 시작 중...${NC}"

# 현재 디렉토리 확인
echo -e "${BLUE}📍 현재 위치: $(pwd)${NC}"

# Gradle 빌드 및 실행
echo -e "${BLUE}🔨 프로젝트 빌드 중...${NC}"
"$PROJECT_ROOT/gradlew" clean build -x test --no-daemon

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 빌드 성공${NC}"
    
    # 서버 실행
    echo -e "${BLUE}🌐 서버 실행 중...${NC}"
    echo -e "${BLUE}🔗 헬스 체크: http://localhost:8080/health${NC}"
    echo -e "${BLUE}🔗 AI 키워드: http://localhost:8080/api/v1/search/ai/keywords${NC}"
    echo -e "${BLUE}🔗 AI 추천: http://localhost:8080/api/v1/search/ai/recommend?keywords=한식,카페${NC}"
    echo -e "${YELLOW}💡 서버를 중지하려면 Ctrl+C를 누르세요${NC}"
    echo ""
    
    # 종료 시 AI 서버도 종료하는 트랩 설정
    trap "echo -e '${YELLOW}🛑 서버 종료 중...${NC}'; kill $AI_PID 2>/dev/null; exit 0" INT TERM
    
    "$PROJECT_ROOT/gradlew" bootRun --no-daemon
else
    echo -e "${RED}❌ 빌드 실패${NC}"
    kill $AI_PID 2>/dev/null
    exit 1
fi
