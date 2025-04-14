# Діаграма послідовності розгортання домену в RokoCDN

Ця діаграма відображає процес створення та розгортання нового домену в системі RokoCDN.

## Процес розгортання домену

```mermaid
sequenceDiagram
    actor Admin as Адміністратор
    participant Frontend as Фронтенд (Vue)
    participant Backend as Бекенд (NestJS)
    participant DB as База даних
    participant CF as Cloudflare API
    participant Ansible as Ansible
    participant Server as VPS Сервер
    
    Admin ->> Frontend: Створити новий домен
    Frontend ->> Backend: POST /api/domains
    
    Backend ->> DB: Перевірити існування домену
    DB -->> Backend: Домен не існує
    
    Backend ->> DB: Створити запис домену (статус: pending)
    DB -->> Backend: Домен створено
    
    Backend ->> CF: Створити DNS-запис
    CF -->> Backend: DNS-запис створено
    
    Backend ->> DB: Оновити статус домену (статус: dns_created)
    DB -->> Backend: Статус оновлено
    
    Backend ->> DB: Створити завдання розгортання (DeployJob)
    DB -->> Backend: Завдання створено
    
    Backend -->> Frontend: 201 Created (Domain + DeployJob)
    Frontend -->> Admin: Показати успішне створення
    
    Backend ->> DB: Отримати дані сервера та конфігурації
    DB -->> Backend: Дані отримано
    
    Backend ->> Ansible: Запустити плейбук розгортання
    
    Ansible ->> Server: SSH підключення
    Server -->> Ansible: Підключено
    
    Ansible ->> Server: Встановити Nginx
    Server -->> Ansible: Nginx встановлено
    
    Ansible ->> Server: Налаштувати конфігурацію
    Server -->> Ansible: Конфігурацію налаштовано
    
    Ansible ->> Server: Отримати SSL-сертифікат
    Server -->> Ansible: Сертифікат отримано
    
    Ansible ->> Server: Перезапустити Nginx
    Server -->> Ansible: Nginx перезапущено
    
    Ansible -->> Backend: Розгортання завершено успішно
    
    Backend ->> DB: Оновити статус завдання (статус: completed)
    DB -->> Backend: Статус оновлено
    
    Backend ->> DB: Оновити статус домену (статус: active)
    DB -->> Backend: Статус оновлено
    
    Note over Admin,Server: Домен успішно розгорнуто і доступний за адресою
```

## Опис процесу

1. **Ініціювання**: Адміністратор через веб-інтерфейс створює новий домен.
2. **Валідація**: Бекенд перевіряє, чи не існує вже такий домен.
3. **Створення DNS**: Бекенд створює DNS-запис через Cloudflare API.
4. **Створення завдання**: Бекенд створює завдання розгортання (DeployJob).
5. **Підготовка даних**: Бекенд отримує дані сервера та конфігурації.
6. **Розгортання**: Ansible виконує плейбук для налаштування сервера:
   - Встановлення Nginx
   - Налаштування конфігурації
   - Отримання SSL-сертифіката
   - Перезапуск Nginx
7. **Завершення**: Бекенд оновлює статуси завдання та домену.

Після успішного завершення всіх етапів, домен стає доступним за вказаною адресою.