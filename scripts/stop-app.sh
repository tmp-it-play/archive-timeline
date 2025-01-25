#!/bin/bash

IMAGE_NAME=hello-app-image
CONTAINER_NAME=hello-app-container
DOCKERFILE_PATH=/home/ec2-user/builds/Dockerfile
if [ ! -d "/home/ec2-user/builds" ]; then
  echo "Directory /home/ec2-user/builds does not exist. Skipping Docker build and run."
  exit 0
fi
cd /home/ec2-user/builds || exit
if ! docker images | grep -q "$IMAGE_NAME"; then
  echo "Docker image '$IMAGE_NAME' not found. Building Docker image..."
  docker build -t "$IMAGE_NAME" -f "$DOCKERFILE_PATH" .
else
  echo "Docker image '$IMAGE_NAME' already exists. Skipping build step."
fi
if docker ps | grep -q "$CONTAINER_NAME"; then
  echo "Stopping and removing existing Docker container '$CONTAINER_NAME'..."
  docker stop "$CONTAINER_NAME"
  docker rm "$CONTAINER_NAME"
else
  echo "Docker container '$CONTAINER_NAME' is not running. Skipping stop and remove steps."
fi
echo "Starting new Docker container..."
docker run -d --name "$CONTAINER_NAME" -p 8080:8080 "$IMAGE_NAME"
