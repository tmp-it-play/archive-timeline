#!/bin/bash
echo "Starting application..."
nohup java -jar /home/ec2-user/app/hello-app.jar --spring.profiles.active=prod > /home/ec2-user/app/app.log 2>&1 &