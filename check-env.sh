#!/bin/bash

echo "🔍 시스템 환경 확인..."

# Python 확인
echo "🐍 Python 확인:"
if command -v python3 &> /dev/null; then
    echo "  ✅ python3: $(python3 --version)"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    echo "  ✅ python: $(python --version)"
    PYTHON_CMD="python"
else
    echo "  ❌ Python이 설치되지 않았습니다"
    echo "  💡 Python 설치: https://www.python.org/downloads/"
    exit 1
fi

# pip 확인
echo "📦 pip 확인:"
if command -v pip3 &> /dev/null; then
    echo "  ✅ pip3: $(pip3 --version)"
    PIP_CMD="pip3"
elif command -v pip &> /dev/null; then
    echo "  ✅ pip: $(pip --version)"
    PIP_CMD="pip"
else
    echo "  ❌ pip이 설치되지 않았습니다"
    echo "  💡 pip 설치: curl https://bootstrap.pypa.io/get-pip.py | $PYTHON_CMD"
    exit 1
fi

# Java 확인
echo "☕ Java 확인:"
if command -v java &> /dev/null; then
    echo "  ✅ Java: $(java -version 2>&1 | head -n 1)"
else
    echo "  ❌ Java가 설치되지 않았습니다"
    echo "  💡 Java 설치가 필요합니다"
    exit 1
fi

# gradlew 확인
echo "🔨 Gradle 확인:"
if [ -f "./gradlew" ]; then
    chmod +x ./gradlew
    echo "  ✅ gradlew 파일 존재"
else
    echo "  ❌ gradlew 파일이 없습니다"
    if command -v gradle &> /dev/null; then
        echo "  🔄 Gradle Wrapper 생성 중..."
        gradle wrapper
        chmod +x ./gradlew
        echo "  ✅ Gradle Wrapper 생성 완료"
    else
        echo "  ❌ Gradle이 설치되지 않았습니다"
        echo "  💡 Gradle 설치가 필요합니다"
        exit 1
    fi
fi

# 환경변수 확인
echo "🔧 환경변수 확인:"
if [ -f ".env" ]; then
    echo "  ✅ .env 파일 존재"
    
    # 필수 환경변수 체크
    source .env 2>/dev/null || true
    
    if [ -n "$NAVER_CLIENT_ID" ]; then
        echo "  ✅ NAVER_CLIENT_ID: ${NAVER_CLIENT_ID:0:10}..."
    else
        echo "  ❌ NAVER_CLIENT_ID가 설정되지 않음"
    fi
    
    if [ -n "$RDB_HOST" ]; then
        echo "  ✅ RDB_HOST: $RDB_HOST"
    else
        echo "  ❌ RDB_HOST가 설정되지 않음"
    fi
else
    echo "  ❌ .env 파일이 없습니다"
    echo "  🔄 .env.example 복사 중..."
    cp .env.example .env
    echo "  💡 .env 파일을 수정하고 다시 실행해주세요"
    exit 1
fi

echo ""
echo "✅ 모든 환경 확인 완료!"
echo ""
echo "🚀 다음 명령어로 서버를 시작할 수 있습니다:"
echo "   ./start.sh"
echo ""
echo "📝 또는 수동으로 실행:"
echo "   1. AI 서버: cd src/main/java/com/snowykte0426/minsole/domain/search/service && $PYTHON_CMD generate.py"
echo "   2. Spring 서버: ./gradlew bootRun"
