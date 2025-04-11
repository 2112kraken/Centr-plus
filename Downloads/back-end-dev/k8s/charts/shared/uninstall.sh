#!/bin/bash

if [ -z "$1" ]; then
   echo "Usage: $0 <environment>"
   echo "Example: $0 dev"
   exit 1
fi

ENV=$1

helm uninstall "shared-$ENV" -n $ENV
