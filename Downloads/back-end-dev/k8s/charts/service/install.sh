#!/bin/bash

if [ $# -ne 2 ]; then
   echo "Usage: $0 <environment> <service-name>"
   echo "Example: $0 dev gateway"
   exit 1
fi

ENV=$1
SERVICE=$2

VALUES_FILE="values/${ENV}/${SERVICE}.yaml"

# Check if the values file exists
if [ ! -f "$VALUES_FILE" ]; then
   echo "Error: Values file $VALUES_FILE not found."
   exit 1
fi

# Install the Helm chart
helm install "$SERVICE-$ENV" . -f "$VALUES_FILE" --namespace "$ENV"

echo "Helm chart for $SERVICE has been installed in the $ENV namespace."
