#!/bin/bash

if [ $# -ne 2 ]; then
   echo "Usage: $0 <environment> <service-name>"
   echo "Example: $0 dev gateway"
   exit 1
fi

ENV=$1
SERVICE=$2

./uninstall.sh $ENV $SERVICE
./install.sh $ENV $SERVICE
