#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
   echo "Usage: $0 <namespace> <name>" 
   echo "Example: $0 dev main"
   exit 1
fi

NAMESPACE=$1
NAME=$2

helm uninstall postgresql-$NAME-$NAMESPACE -n "$NAMESPACE"
kubectl delete pvc data-postgresql-$NAME-$NAMESPACE-0 -n "$NAMESPACE"

echo "PostgreSQL has been uninstalled from the $NAMESPACE namespace."
