#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: $0 <namespace> <name> <password>"
    echo "Example: $0 dev main mypassword"
    exit 1
fi

NAMESPACE=$1
NAME=$2
PASSWORD=$3

helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install PostgreSQL with the provided password
helm install "postgresql-${NAME}-${NAMESPACE}" bitnami/postgresql \
    --namespace "${NAMESPACE}" \
    -f "${NAME}/${NAMESPACE}.values.yaml" \
    --set global.postgresql.auth.postgresPassword="${PASSWORD}"

echo "PostgreSQL has been installed in the ${NAMESPACE} namespace with the provided password."