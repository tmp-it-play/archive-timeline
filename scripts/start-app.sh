#!/bin/bash
CONTAINER_NAME=hello-app-container
echo "Stopping the running Docker container if exists..."
CURRENT_CONTAINER_ID=$(docker ps -q -f name=$CONTAINER_NAME)
if [ -z "$CURRENT_CONTAINER_ID" ]; then
  echo "No running container found. Skipping stop."
else
  echo "Stopping container $CURRENT_CONTAINER_ID..."
  docker stop $CURRENT_CONTAINER_ID
  echo "Removing container $CURRENT_CONTAINER_ID..."
  docker rm $CURRENT_CONTAINER_ID
fi