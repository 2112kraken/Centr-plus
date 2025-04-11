#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: $0 <namespace> <name> <password>"
    echo "Example: $0 dev main mypassword"
    exit 1
fi

NAMESPACE=$1
NAME=$2
PASSWORD=$3

# Add the Bitnami Helm repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install Redis with the provided password
helm install "redis-${NAME}-${NAMESPACE}" bitnami/redis \
    --namespace "${NAMESPACE}" \
    -f "${NAMESPACE}/values.yaml" \
    --set auth.password="${PASSWORD}" \
    --set global.redis.password="${PASSWORD}" \
    --set architecture=standalone \
    --set persistence.enabled=true

echo "Redis has been installed in the ${NAMESPACE} namespace with the provided password."
