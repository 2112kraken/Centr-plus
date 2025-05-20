#!/bin/bash

# Скрипт для автоматической настройки дроплета DigitalOcean
# Запускать на дроплете с правами root

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
  echo -e "${GREEN}[SETUP]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Проверка прав root
if [ "$(id -u)" != "0" ]; then
   warn "Этот скрипт должен быть запущен с правами root"
   exit 1
fi

# Переменные
DB_NAME="centrplus"
DB_USER="centruser"
DB_PASSWORD="your_strong_password" # Измените на свой пароль
PROJECT_DIR="/var/www/sk-rancho"
DOMAIN="sk-rancho.com"
API_DOMAIN="api.sk-rancho.com"
WWW_DOMAIN="www.sk-rancho.com"

log "Начало настройки сервера для $DOMAIN..."

# 1. Обновление системы
log "Обновление системы..."
apt update && apt upgrade -y

# 2. Установка необходимого ПО
log "Установка Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

log "Установка PNPM..."
npm install -g pnpm

log "Установка PM2..."
npm install -g pm2

log "Установка Nginx..."
apt install -y nginx

log "Установка PostgreSQL..."
apt install -y postgresql postgresql-contrib

log "Установка Certbot..."
apt install -y certbot python3-certbot-nginx

# 3. Настройка базы данных PostgreSQL
log "Настройка базы данных PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# 4. Создание директории для проекта
log "Создание директории для проекта..."
mkdir -p $PROJECT_DIR
chown -R $USER:$USER $PROJECT_DIR
chmod -R 755 $PROJECT_DIR

# 5. Настройка Nginx
log "Настройка Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN $WWW_DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 80;
    server_name $API_DOMAIN;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 6. Настройка SSL с Certbot
log "Настройка SSL с Certbot..."
certbot --nginx -d $DOMAIN -d $WWW_DOMAIN -d $API_DOMAIN --non-interactive --agree-tos --email your-email@example.com

# 7. Создание файла конфигурации PM2
log "Создание файла конфигурации PM2..."
cat > $PROJECT_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'npm',
      args: 'start',
      cwd: '$PROJECT_DIR',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME',
        SITE_URL: 'https://$DOMAIN',
        DEFAULT_LOCALE: 'uk',
        SUPPORTED_LOCALES: 'uk,en',
        SKIP_ENV_VALIDATION: 'true'
      }
    },
    {
      name: 'api',
      script: 'npm',
      args: 'run start:api',
      cwd: '$PROJECT_DIR/apps/api',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME',
        DEFAULT_LOCALE: 'uk',
        SUPPORTED_LOCALES: 'uk,en'
      }
    }
  ]
};
EOF

# 8. Настройка PM2 для автозапуска
log "Настройка PM2 для автозапуска..."
pm2 startup
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root

log "Настройка сервера завершена!"
log "Теперь вам нужно:"
log "1. Настроить DNS-записи в GoDaddy"
log "2. Добавить SSH ключ в GitHub Secrets"
log "3. Запушить изменения в GitHub для автоматического деплоя"

log "Для ручного деплоя используйте скрипт deploy-droplet.sh"