#!/bin/sh

# Set arguments with defaults
APP_NAME=${1:-${APP_NAME:-"undefined"}}
NODE_ENV=${2:-${NODE_ENV:-"local"}}

echo "Running migration with:"
echo "App Name: $APP_NAME"
echo "Node Env: $NODE_ENV"

# Run the migration command
APP_NAME=$APP_NAME NODE_ENV=$NODE_ENV npx ts-node -r tsconfig-paths/register \
    node_modules/typeorm/cli.js migration:run \
    -d data-source.ts
