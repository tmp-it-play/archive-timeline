#!/bin/bash

IMAGE_NAME=hello-app-image
CONTAINER_NAME=hello-app-container
DOCKERFILE_PATH=/home/ec2-user/builds/Dockerfile
if [ ! -d "/home/ec2-user/builds" ]; then
  echo "Directory /home/ec2-user/builds does not exist. Creating directory..."
  mkdir -p /home/ec2-user/builds
fi
cd /home/ec2-user/builds || exit
if ! docker images | grep -q "$IMAGE_NAME"; then
  echo "Docker image '$IMAGE_NAME' not found. Skipping image build step."
else
  echo "Docker image '$IMAGE_NAME' exists. Skipping image build step."
fi
if docker ps -a | grep -q "$CONTAINER_NAME"; then
  echo "Stopping and removing existing Docker container '$CONTAINER_NAME'..."
  docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || echo "Container '$CONTAINER_NAME' is already stopped."
  docker rm "$CONTAINER_NAME" >/dev/null 2>&1 || echo "Container '$CONTAINER_NAME' is already removed."
else
  echo "Docker container '$CONTAINER_NAME' does not exist. Skipping stop and remove steps."
fi
echo "Script completed successfully."
exit 0