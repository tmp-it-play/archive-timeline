#!/bin/bash
APP_DIR=/home/ec2-user/app
IMAGE_NAME=hello-app-img
CONTAINER_NAME=hello-app
DOCKERFILE_NAME=Dockerfile
echo "INFO: 현재 실행 중인 컨테이너를 확인합니다..."
CURRENT_CONTAINER_ID=$(docker ps -q -f name=$CONTAINER_NAME)
if [ ! -z "$CURRENT_CONTAINER_ID" ]; then
  echo "INFO: 실행 중인 컨테이너를 중지 및 삭제합니다."
  docker stop $CONTAINER_NAME
  docker rm $CONTAINER_NAME
fi
echo "INFO: 공간 확보를 위하여 Docker Clean-up 작업을 수행합니다..."
docker system prune -f
echo "INFO: 애플리케이션 디렉토리로 이동합니다: $APP_DIR"
cd $APP_DIR || { echo "ERROR: 디렉토리 $APP_DIR 를 찾을 수 없습니다. 종료합니다."; exit 1; }
echo "INFO: Docker 이미지를 빌드합니다: $IMAGE_NAME"
if docker build -t $IMAGE_NAME -f $DOCKERFILE_NAME .; then
  echo "INFO: Docker 이미지 빌드 완료: $IMAGE_NAME"
else
  echo "ERROR: Docker 이미지 빌드 실패. 종료합니다."
  exit 1
fi
echo "INFO: Docker 컨테이너를 실행합니다: $CONTAINER_NAME"
if docker run -d --name $CONTAINER_NAME -p 8080:8080 --restart always $IMAGE_NAME; then
  echo "INFO: Docker 컨테이너 실행 성공: $CONTAINER_NAME"
else
  echo "ERROR: Docker 컨테이너 실행 실패. 종료합니다."
  exit 1
fi
echo "INFO: 배포 작업이 완료되었습니다!"