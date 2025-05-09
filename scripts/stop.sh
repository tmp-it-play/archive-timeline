#!/bin/bash
APP_NAME=hello-app
echo "INFO: ApplicationStop 단계 시작 - 실행 중인 컨테이너 중지 및 삭제"
CONTAINER_ID=$(docker ps -q -f name=$APP_NAME)
if [ -n "$CONTAINER_ID" ]; then
  echo "INFO: 컨테이너 중지 중..."
  docker stop $APP_NAME
  docker rm $APP_NAME
  echo "INFO: 컨테이너 제거 완료"
else
  echo "INFO: 중지할 컨테이너 없음"
fi
exit 0