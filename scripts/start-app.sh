#!/bin/bash

IMAGE_NAME=hello-app-image
CONTAINER_NAME=hello-app-container
DOCKERFILE_PATH=/home/ec2-user/builds/Dockerfile
if [ ! -d "/home/ec2-user/builds" ]; then
  echo "ERROR: Directory /home/ec2-user/builds does not exist. Skipping Docker build and run."
  exit 1
fi
cd /home/ec2-user/builds || {
  echo "ERROR: Failed to change directory to /home/ec2-user/builds."
  exit 1
}
if ! docker images | grep -q "$IMAGE_NAME"; then
  echo "INFO: Docker image '$IMAGE_NAME' not found. Building Docker image..."
  if ! docker build -t "$IMAGE_NAME" -f "$DOCKERFILE_PATH" .; then
    echo "ERROR: Failed to build Docker image '$IMAGE_NAME'."
    exit 1
  fi
else
  echo "INFO: Docker image '$IMAGE_NAME' already exists. Skipping build step."
fi
if docker ps | grep -q "$CONTAINER_NAME"; then
  echo "INFO: Stopping and removing existing Docker container '$CONTAINER_NAME'..."
  if ! docker stop "$CONTAINER_NAME"; then
    echo "ERROR: Failed to stop container '$CONTAINER_NAME'."
    exit 1
  fi
  if ! docker rm "$CONTAINER_NAME"; then
    echo "ERROR: Failed to remove container '$CONTAINER_NAME'."
    exit 1
  fi
else
  echo "INFO: Docker container '$CONTAINER_NAME' is not running. Skipping stop and remove steps."
fi
echo "INFO: Starting new Docker container..."
if docker run -d --name "$CONTAINER_NAME" -p 8080:8080 "$IMAGE_NAME"; then
  echo "INFO: Docker container '$CONTAINER_NAME' started successfully."
else
  echo "ERROR: Failed to start Docker container '$CONTAINER_NAME'."
  exit 1
fi