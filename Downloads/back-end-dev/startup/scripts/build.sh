#!/bin/bash

# Check if the application name is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: ./build.sh <app_name>"
  exit 1
fi

# Assign the application name from the first argument
APP_NAME=$1

# Enable Docker BuildKit and start the build
DOCKER_BUILDKIT=1 docker buildx build --progress=plain \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --build-arg APP_NAME=$APP_NAME \
  -t $APP_NAME .
