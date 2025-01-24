#!/bin/bash
echo "Stopping the application..."
pkill -f "java -jar" || true