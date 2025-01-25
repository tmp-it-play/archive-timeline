#!/bin/bash
IMAGE_NAME=hello-app-image
CONTAINER_NAME=hello-app-container
DOCKERFILE_PATH=/home/ec2-user/builds/Dockerfile
BUILD_DIR=/home/ec2-user/builds
if [ ! -d "$BUILD_DIR" ]; then
  echo "ERROR: Directory '$BUILD_DIR' does not exist. Exiting."
  exit 1
fi
cd "$BUILD_DIR" || {
  echo "ERROR: Failed to change directory to '$BUILD_DIR'. Exiting."
  exit 1
}
echo "INFO: Building Docker image '$IMAGE_NAME'..."
if ! docker build -t "$IMAGE_NAME" -f "$DOCKERFILE_PATH" .; then
  echo "ERROR: Failed to build Docker image '$IMAGE_NAME'. Exiting."
  exit 1
fi
echo "INFO: Starting Docker container '$CONTAINER_NAME'..."
if docker run -d --name "$CONTAINER_NAME" -p 8080:8080 "$IMAGE_NAME"; then
  echo "INFO: Docker container '$CONTAINER_NAME' started successfully."
else
  echo "ERROR: Failed to start Docker container '$CONTAINER_NAME'. Exiting."
  exit 1
fi