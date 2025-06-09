@echo off
rem Windows용 환경변수 로드 및 서버 실행 스크립트

echo 🚀 Minsole BigData Server 시작

rem .env 파일 확인
if not exist ".env" (
    echo ⚠️  .env 파일이 없습니다. .env.example을 복사합니다...
    copy .env.example .env
    echo ❌ .env 파일을 수정하고 다시 실행해주세요!
    pause
    exit /b 1
)

rem .env 파일에서 환경변수 로드
echo 📋 환경변수 로드 중...
for /f "tokens=1,2 delims==" %%a in (.env) do (
    if not "%%a"=="" if not "%%a:~0,1%"=="#" (
        set "%%a=%%b"
    )
)

rem 필수 환경변수 체크
echo 🔍 필수 환경변수 확인 중...
if "%NAVER_CLIENT_ID%"=="" (
    echo ❌ NAVER_CLIENT_ID가 설정되지 않았습니다
    pause
    exit /b 1
)
if "%NAVER_CLIENT_SECRET%"=="" (
    echo ❌ NAVER_CLIENT_SECRET가 설정되지 않았습니다
    pause
    exit /b 1
)
if "%RDB_HOST%"=="" (
    echo ❌ RDB_HOST가 설정되지 않았습니다
    pause
    exit /b 1
)
if "%RDB_PASSWORD%"=="" (
    echo ❌ RDB_PASSWORD가 설정되지 않았습니다
    pause
    exit /b 1
)

echo ✅ 환경변수 확인 완료

rem Python AI 서버 시작
echo 🤖 AI 서버 시작 중...
cd src\main\java\com\snowykte0426\minsole\domain\search\service

rem Python 의존성 설치 확인
python -c "import fastapi, pymysql, redis, openai" 2>nul
if errorlevel 1 (
    echo 📦 Python 의존성 설치 중...
    pip install fastapi uvicorn pymysql redis openai python-multipart
)

rem AI 서버 백그라운드 실행
start /b python generate.py
echo ✅ AI 서버 시작됨

rem 원래 디렉토리로 돌아가기
cd ..\..\..\..\..\..\

rem Spring Boot 서버 시작
echo ☕ Spring Boot 서버 시작 중...
gradlew.bat clean build -x test
if errorlevel 1 (
    echo ❌ 빌드 실패
    pause
    exit /b 1
)

echo ✅ 빌드 성공
echo 🌐 서버 실행 중... (http://localhost:8080)
gradlew.bat bootRun

pause
