# Архітектурна діаграма RokoCDN

Ця діаграма відображає основні компоненти системи RokoCDN та їх взаємодію.

## Загальна архітектура системи

```mermaid
flowchart TB
    subgraph "Користувачі"
        Admin["Адміністратор"]
    end

    subgraph "Фронтенд (Vue.js)"
        UI["Веб-інтерфейс"]
        Store["Pinia Store"]
        Router["Vue Router"]
        API_Service["API Service"]
    end

    subgraph "Бекенд (NestJS)"
        API["REST API"]
        
        subgraph "Модулі"
            AuthModule["Auth Module"]
            ProjectsModule["Projects Module"]
            ServersModule["Servers Module"]
            DomainsModule["Domains Module"]
            DnsRecordsModule["DNS Records Module"]
            ConfigsModule["Configs Module"]
            DeployJobsModule["Deploy Jobs Module"]
            RedirectorsModule["Redirectors Module"]
            LogsModule["Logs Module"]
            TagsModule["Tags Module"]
        end
        
        subgraph "Сервіси інтеграції"
            CloudflareService["Cloudflare Service"]
            AnsibleService["Ansible Executor Service"]
        end
    end

    subgraph "База даних"
        PostgreSQL["PostgreSQL"]
    end

    subgraph "Зовнішні сервіси"
        Cloudflare["Cloudflare API"]
        Ansible["Ansible"]
        VPS["VPS Servers"]
    end

    Admin --> UI
    UI --> Router
    UI --> Store
    Store --> API_Service
    API_Service --> API

    API --> AuthModule
    API --> ProjectsModule
    API --> ServersModule
    API --> DomainsModule
    API --> DnsRecordsModule
    API --> ConfigsModule
    API --> DeployJobsModule
    API --> RedirectorsModule
    API --> LogsModule
    API --> TagsModule

    AuthModule --> PostgreSQL
    ProjectsModule --> PostgreSQL
    ServersModule --> PostgreSQL
    DomainsModule --> PostgreSQL
    DnsRecordsModule --> PostgreSQL
    ConfigsModule --> PostgreSQL
    DeployJobsModule --> PostgreSQL
    RedirectorsModule --> PostgreSQL
    LogsModule --> PostgreSQL
    TagsModule --> PostgreSQL

    DomainsModule --> CloudflareService
    DnsRecordsModule --> CloudflareService
    DeployJobsModule --> AnsibleService
    
    CloudflareService --> Cloudflare
    AnsibleService --> Ansible
    Ansible --> VPS

    classDef frontend fill:#42b883,stroke:#35495e,color:white;
    classDef backend fill:#ea2845,stroke:#c5162e,color:white;
    classDef database fill:#326690,stroke:#254e6c,color:white;
    classDef external fill:#f5a623,stroke:#e09612,color:white;
    classDef user fill:#9013fe,stroke:#7311c7,color:white;

    class UI,Store,Router,API_Service frontend;
    class API,AuthModule,ProjectsModule,ServersModule,DomainsModule,DnsRecordsModule,ConfigsModule,DeployJobsModule,RedirectorsModule,LogsModule,TagsModule,CloudflareService,AnsibleService backend;
    class PostgreSQL database;
    class Cloudflare,Ansible,VPS external;
    class Admin user;
```

## Опис компонентів

### Фронтенд
- **Веб-інтерфейс (UI)**: Vue.js компоненти для взаємодії з користувачем
- **Pinia Store**: Управління станом додатку
- **Vue Router**: Маршрутизація між сторінками
- **API Service**: Сервіс для взаємодії з бекендом

### Бекенд
- **REST API**: Основний інтерфейс для взаємодії з фронтендом
- **Модулі**: Функціональні модулі системи (Auth, Projects, Servers, Domains, DNS Records, Configs, Deploy Jobs, Redirectors, Logs, Tags)
- **Сервіси інтеграції**: Сервіси для взаємодії з зовнішніми системами (Cloudflare, Ansible)

### База даних
- **PostgreSQL**: Реляційна база даних для зберігання всіх даних системи

### Зовнішні сервіси
- **Cloudflare API**: API для управління DNS-записами
- **Ansible**: Інструмент для автоматизації розгортання
- **VPS Servers**: Віртуальні сервери для розгортання дзеркал та редиректорів