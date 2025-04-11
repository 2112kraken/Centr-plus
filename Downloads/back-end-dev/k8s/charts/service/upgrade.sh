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

# Delete the migration job if it exists
kubectl delete job "$SERVICE-migration" --namespace "$ENV" --ignore-not-found=true

# Upgrade the Helm chart
helm upgrade "$SERVICE-$ENV" --namespace "$ENV" --force

echo "Helm chart for $SERVICE has been upgraded in the $ENV namespace."
