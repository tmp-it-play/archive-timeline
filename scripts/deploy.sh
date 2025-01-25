#!/bin/bash
echo "Stopping existing application..."
pkill -f 'java -jar' || true
echo "Downloading new application..."
aws s3 cp s3://cicd-pratice/hello-app.jar /home/ec2-user/hello-app.jar
echo "Starting application..."
nohup java -jar /home/ec2-user/hello-app.jar --spring.profiles.active=prod > /dev/null 2>&1 &