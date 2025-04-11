#!/bin/bash

# Загрузка переменных окружения из .env.prom
if [ -f .env.prom ]; then
  export $(grep -v '^#' .env.prom | xargs)
  echo "Loaded environment variables from .env.prom"
else
  echo "Error: .env.prom file not found"
  exit 1
fi

# Проверка наличия токена Grafana
if [ -z "$GRAFANA_TOKEN" ]; then
  echo "Error: GRAFANA_TOKEN is not set in .env.prom"
  exit 1
fi

# Запуск Prometheus и Grafana
echo "Starting Prometheus and Grafana..."
docker-compose up -d prometheus grafana

# Проверка статуса
echo "Checking status..."
sleep 5
docker-compose ps prometheus grafana

echo "Prometheus is available at http://localhost:9090"
echo "Grafana is available at http://localhost:3009"
echo "Default Grafana credentials: admin/admin"