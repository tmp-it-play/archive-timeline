#!/bin/bash

# 빠른 테스트 스크립트

PROJECT_ROOT=$(pwd)
echo "🧪 빠른 테스트 시작"
echo "📍 프로젝트 경로: $PROJECT_ROOT"

# 1. gradlew 파일 확인
echo ""
echo "🔨 Gradle 확인:"
if [ -f "$PROJECT_ROOT/gradlew" ]; then
    chmod +x "$PROJECT_ROOT/gradlew"
    echo "  ✅ gradlew 파일 존재하고 실행 권한 부여됨"
    
    # gradlew 버전 확인
    echo "  📋 Gradle 버전 확인 중..."
    "$PROJECT_ROOT/gradlew" --version --no-daemon
    
    if [ $? -eq 0 ]; then
        echo "  ✅ Gradle 정상 작동"
    else
        echo "  ❌ Gradle 실행 실패"
        exit 1
    fi
else
    echo "  ❌ gradlew 파일이 없습니다"
    exit 1
fi

# 2. AI 서버 파일 확인
echo ""
echo "🤖 AI 서버 파일 확인:"
AI_SERVER_FILE="$PROJECT_ROOT/src/main/java/com/snowykte0426/minsole/domain/search/service/generate.py"
if [ -f "$AI_SERVER_FILE" ]; then
    echo "  ✅ generate.py 파일 존재"
    
    # Python 문법 체크
    if command -v python3 &> /dev/null; then
        python3 -m py_compile "$AI_SERVER_FILE" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "  ✅ Python 문법 검사 통과"
        else
            echo "  ⚠️  Python 문법 검사 실패 (실행 시 확인 필요)"
        fi
    fi
else
    echo "  ❌ generate.py 파일이 없습니다"
    exit 1
fi

# 3. 환경변수 확인
echo ""
echo "🔧 환경변수 확인:"
if [ -f "$PROJECT_ROOT/.env" ]; then
    echo "  ✅ .env 파일 존재"
    
    # 환경변수 로드
    source "$PROJECT_ROOT/.env" 2>/dev/null
    
    if [ -n "$NAVER_CLIENT_ID" ]; then
        echo "  ✅ NAVER_CLIENT_ID: ${NAVER_CLIENT_ID:0:10}..."
    else
        echo "  ⚠️  NAVER_CLIENT_ID가 설정되지 않음"
    fi
    
    if [ -n "$RDB_HOST" ]; then
        echo "  ✅ RDB_HOST: $RDB_HOST"
    else
        echo "  ⚠️  RDB_HOST가 설정되지 않음"
    fi
else
    echo "  ❌ .env 파일이 없습니다"
    exit 1
fi

# 4. 컴파일 테스트
echo ""
echo "📦 컴파일 테스트:"
echo "  🔄 Java 컴파일 확인 중..."
"$PROJECT_ROOT/gradlew" compileJava --no-daemon --quiet

if [ $? -eq 0 ]; then
    echo "  ✅ Java 컴파일 성공"
else
    echo "  ❌ Java 컴파일 실패"
    echo "  💡 상세 오류 확인: ./gradlew compileJava"
    exit 1
fi

echo ""
echo "🎉 모든 테스트 통과!"
echo ""
echo "🚀 다음 단계:"
echo "1. 서버 시작: ./start.sh"
echo "2. 수동 실행:"
echo "   - AI 서버: cd src/main/java/com/snowykte0426/minsole/domain/search/service && python3 generate.py"
echo "   - Spring 서버: ./gradlew bootRun"
echo ""
echo "🔗 실행 후 테스트 URL:"
echo "   - 헬스 체크: http://localhost:8080/health"
echo "   - AI 키워드: http://localhost:8080/api/v1/search/ai/keywords"
