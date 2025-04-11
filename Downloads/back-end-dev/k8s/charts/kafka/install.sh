#!/bin/bash

if [ $# -ne 2 ]; then
   echo "Usage: $0 <environment> <service-name>"
   echo "Example: $0 dev kafka"
   exit 1
fi

ENV=$1
SERVICE=$2


# Install the Helm chart
helm install "$SERVICE" . --namespace "$ENV"

echo "Helm chart for $SERVICE has been installed in the $ENV namespace."
