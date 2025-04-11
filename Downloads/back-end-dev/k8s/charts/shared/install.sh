#!/bin/bash

if [ $# -ne 1 ]; then
   echo "Usage: $0 <environment>"
   echo "Example: $0 dev"
   exit 1
fi

ENV=$1

VALUES_FILE="examples/${ENV}.values.yaml"

if [ ! -f "$VALUES_FILE" ]; then
   echo "Error: Values file $VALUES_FILE not found"
   exit 1
fi

helm install "shared-$ENV" . -f "$VALUES_FILE" -n "$ENV"
