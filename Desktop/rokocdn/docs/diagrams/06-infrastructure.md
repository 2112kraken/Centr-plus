# Діаграма інфраструктури RokoCDN

Ця діаграма відображає фізичні компоненти системи RokoCDN та їх взаємодію.

## Інфраструктура системи

```mermaid
flowchart TB
    subgraph "Користувачі"
        Admin["Адміністратор\n(Браузер)"]
    end

    subgraph "Адміністративний сервер"
        Frontend["Фронтенд\n(Vue.js + Nginx)"]
        Backend["Бекенд\n(NestJS)"]
        DB["База даних\n(PostgreSQL)"]
        
        Frontend --- Backend
        Backend --- DB
    end

    subgraph "Cloudflare"
        CF_DNS["DNS Management"]
        CF_CDN["CDN / Proxy"]
        CF_SSL["SSL Certificates"]
        
        CF_DNS --- CF_CDN
        CF_CDN --- CF_SSL
    end

    subgraph "Дзеркала"
        Mirror1["Дзеркало 1\n(Nginx + SSL)"]
        Mirror2["Дзеркало 2\n(Nginx + SSL)"]
        Mirror3["Дзеркало 3\n(Nginx + SSL)"]
    end

    subgraph "Редиректори"
        Redirector1["Редиректор 1\n(Nginx + HTML)"]
        Redirector2["Редиректор 2\n(Nginx + HTML)"]
    end

    subgraph "Кінцеві користувачі"
        User1["Користувач 1\n(Браузер)"]
        User2["Користувач 2\n(Браузер)"]
        User3["Користувач 3\n(Браузер)"]
    end

    %% Зв'язки між компонентами
    Admin -- "HTTPS" --> Frontend
    
    Backend -- "HTTPS API" --> CF_DNS
    Backend -- "SSH + Ansible" --> Mirror1
    Backend -- "SSH + Ansible" --> Mirror2
    Backend -- "SSH + Ansible" --> Mirror3
    Backend -- "SSH + Ansible" --> Redirector1
    Backend -- "SSH + Ansible" --> Redirector2
    
    User1 -- "HTTPS" --> CF_CDN
    User2 -- "HTTPS" --> CF_CDN
    User3 -- "HTTPS" --> CF_CDN
    
    CF_CDN -- "HTTPS" --> Mirror1
    CF_CDN -- "HTTPS" --> Mirror2
    CF_CDN -- "HTTPS" --> Mirror3
    CF_CDN -- "HTTPS" --> Redirector1
    CF_CDN -- "HTTPS" --> Redirector2
    
    %% Стилі для різних груп компонентів
    classDef admin fill:#9013fe,stroke:#7311c7,color:white;
    classDef server fill:#ea2845,stroke:#c5162e,color:white;
    classDef cloudflare fill:#f5a623,stroke:#e09612,color:white;
    classDef mirror fill:#42b883,stroke:#35495e,color:white;
    classDef redirector fill:#326690,stroke:#254e6c,color:white;
    classDef user fill:#4a90e2,stroke:#2e6fc1,color:white;

    class Admin admin;
    class Frontend,Backend,DB server;
    class CF_DNS,CF_CDN,CF_SSL cloudflare;
    class Mirror1,Mirror2,Mirror3 mirror;
    class Redirector1,Redirector2 redirector;
    class User1,User2,User3 user;
```

## Опис компонентів інфраструктури

### Адміністративний сервер
- **Фронтенд (Vue.js + Nginx)**: Веб-інтерфейс для управління системою
- **Бекенд (NestJS)**: API-сервер для обробки запитів від фронтенду
- **База даних (PostgreSQL)**: Зберігання всіх даних системи

### Cloudflare
- **DNS Management**: Управління DNS-записами для доменів
- **CDN / Proxy**: Кешування та проксіювання запитів до дзеркал та редиректорів
- **SSL Certificates**: Управління SSL-сертифікатами для доменів

### Дзеркала
- **Дзеркало 1, 2, 3**: Сервери з Nginx, які містять копії контенту оригінального сайту

### Редиректори
- **Редиректор 1, 2**: Сервери з Nginx, які перенаправляють користувачів на інші сайти

### Користувачі
- **Адміністратор**: Управляє системою через веб-інтерфейс
- **Кінцеві користувачі**: Отримують доступ до контенту через дзеркала або перенаправляються через редиректори

## Потоки даних в інфраструктурі

### Адміністрування системи
1. Адміністратор взаємодіє з фронтендом через HTTPS
2. Фронтенд взаємодіє з бекендом через локальний зв'язок
3. Бекенд зберігає та отримує дані з бази даних

### Розгортання та налаштування
1. Бекенд взаємодіє з Cloudflare API для управління DNS-записами
2. Бекенд використовує SSH та Ansible для розгортання та налаштування дзеркал та редиректорів

### Доступ кінцевих користувачів
1. Користувачі звертаються до доменів через HTTPS
2. Запити проходять через Cloudflare CDN/Proxy
3. Cloudflare перенаправляє запити до відповідних дзеркал або редиректорів
4. Дзеркала повертають контент, а редиректори перенаправляють користувачів на інші сайти