#!/bin/bash

echo "🔧 빌드 테스트 중..."

# 환경변수 로드
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ 환경변수 로드됨"
fi

# 정리
echo "🧹 이전 빌드 정리 중..."
./gradlew clean --no-daemon

# 컴파일 테스트
echo "📦 컴파일 확인 중..."
./gradlew compileJava --no-daemon --info

if [ $? -eq 0 ]; then
    echo "✅ 컴파일 성공!"
    
    # 테스트 없이 빌드
    echo "📦 빌드 테스트 중..."
    ./gradlew build -x test --no-daemon
    
    if [ $? -eq 0 ]; then
        echo "✅ 빌드 성공!"
        echo "🚀 이제 ./start.sh 또는 ./gradlew bootRun으로 서버를 시작할 수 있습니다."
    else
        echo "❌ 빌드 실패. 오류를 확인해주세요."
        exit 1
    fi
else
    echo "❌ 컴파일 실패. 오류를 확인해주세요."
    exit 1
fi
