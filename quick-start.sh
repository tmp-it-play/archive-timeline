#!/bin/bash

echo "🚀 빠른 시작 가이드"
echo ""

# 실행 권한 부여
echo "🔧 실행 권한 설정 중..."
chmod +x start.sh
chmod +x check-env.sh
chmod +x test-build.sh

if [ -f "gradlew" ]; then
    chmod +x gradlew
    echo "✅ gradlew 권한 설정 완료"
fi

echo "✅ 모든 스크립트 권한 설정 완료"
echo ""

# 환경 확인
echo "🔍 시스템 환경 확인..."
./check-env.sh

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 모든 준비 완료!"
    echo ""
    echo "📋 다음 단계:"
    echo "1. 환경변수 확인: cat .env"
    echo "2. 빌드 테스트: ./test-build.sh"
    echo "3. 서버 시작: ./start.sh"
    echo ""
    
    read -p "지금 서버를 시작하시겠습니까? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 서버 시작 중..."
        ./start.sh
    else
        echo "💡 준비가 되면 ./start.sh 명령어로 서버를 시작하세요"
    fi
else
    echo ""
    echo "❌ 환경 설정에 문제가 있습니다. 위의 안내를 따라 해결해주세요."
fi
