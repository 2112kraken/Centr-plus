#!/bin/bash

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <migration-name> [app-name] [node-env]"
    echo "Example: $0 CreateUserTable my-app local"
    exit 1
fi

MIGRATION_NAME=$1
APP_NAME=${2:-${APP_NAME:-"undefined"}}
NODE_ENV=${3:-${NODE_ENV:-"local"}}

echo "Creating migration with:"
echo "Migration Name: $MIGRATION_NAME"
echo "App Name: $APP_NAME"
echo "Node Env: $NODE_ENV"

APP_NAME=$APP_NAME NODE_ENV=$NODE_ENV npx ts-node -r tsconfig-paths/register \
    node_modules/typeorm/cli.js migration:generate \
    "apps/$APP_NAME/migrations/$MIGRATION_NAME" \
    -d data-source.ts
