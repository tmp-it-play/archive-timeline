#!/bin/bash

IMAGE_NAME=hello-app-image
CONTAINER_NAME=hello-app-container
DOCKERFILE_PATH=/home/ec2-user/builds/Dockerfile
# shellcheck disable=SC2164
cd /home/ec2-user/builds
echo "Building Docker image..."
docker build -t $IMAGE_NAME -f $DOCKERFILE_PATH .
echo "Starting new Docker container..."
docker run -d --name $CONTAINER_NAME -p 8080:8080 $IMAGE_NAME