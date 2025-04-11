#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
   echo "Usage: $0 <environment> <service>"
   echo "Example: $0 dev identity"
   exit 1
fi

ENV=$1
SERVICE=$2

helm uninstall ${SERVICE}-${ENV} -n $ENV
