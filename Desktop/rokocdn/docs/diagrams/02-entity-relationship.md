# ER-діаграма RokoCDN

Ця діаграма відображає модель даних системи RokoCDN та зв'язки між сутностями.

## Модель даних

```mermaid
erDiagram
    User ||--o{ Project : "створює"
    User ||--o{ Server : "створює"
    User ||--o{ Domain : "створює"
    User ||--o{ DnsRecord : "створює"
    User ||--o{ Config : "створює"
    User ||--o{ DeployJob : "створює"
    User ||--o{ Redirector : "створює"
    User ||--o{ Log : "створює"
    
    Project ||--o{ Server : "має"
    Project }o--o{ Tag : "має"
    
    Server }o--o{ Tag : "має"
    
    Domain ||--o{ DnsRecord : "має"
    Domain }o--o{ Tag : "має"
    
    DnsRecord }o--o{ Tag : "має"
    
    Config }o--o{ Tag : "має"
    
    DeployJob ||--|| Project : "відноситься до"
    DeployJob ||--|| Server : "виконується на"
    DeployJob ||--|| Config : "використовує"
    DeployJob }o--o{ Tag : "має"
    
    Redirector }o--o{ Tag : "має"
    
    User {
        uuid id PK
        string email
        string password
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    
    Project {
        uuid id PK
        string name
        string description
        uuid userId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Server {
        uuid id PK
        string name
        string ipv4
        string ssh_user
        string ssh_key
        uuid userId FK
        uuid projectId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Domain {
        uuid id PK
        string name
        string type
        string cfZoneId
        string cfApiToken
        boolean cfEnabled
        uuid userId FK
        datetime createdAt
        datetime updatedAt
    }
    
    DnsRecord {
        uuid id PK
        string name
        string type
        string value
        int ttl
        string cfRecordId
        boolean cfSynced
        uuid domainId FK
        uuid userId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Config {
        uuid id PK
        string name
        string nginxConfig
        uuid userId FK
        datetime createdAt
        datetime updatedAt
    }
    
    DeployJob {
        uuid id PK
        enum status
        string log
        uuid projectId FK
        uuid serverId FK
        uuid configId FK
        uuid userId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Redirector {
        uuid id PK
        string htmlContent
        uuid userId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Log {
        uuid id PK
        enum level
        string message
        string details
        uuid userId FK
        datetime createdAt
    }
    
    Tag {
        uuid id PK
        string name
        string description
        datetime createdAt
        datetime updatedAt
    }
```

## Опис сутностей

### User (Користувач)
Представляє адміністратора системи, який має доступ до панелі управління.

### Project (Проект)
Представляє проект, для якого створюються дзеркала, проксі або редиректори.

### Server (Сервер)
Представляє VPS-сервер, на якому розгортаються дзеркала, проксі або редиректори.

### Domain (Домен)
Представляє доменне ім'я, яке використовується для доступу до дзеркала, проксі або редиректора.

### DnsRecord (DNS-запис)
Представляє DNS-запис, який пов'язує доменне ім'я з IP-адресою сервера.

### Config (Конфігурація)
Представляє конфігурацію Nginx для дзеркала, проксі або редиректора.

### DeployJob (Завдання розгортання)
Представляє завдання розгортання дзеркала, проксі або редиректора на сервері.

### Redirector (Редиректор)
Представляє редиректор, який перенаправляє користувачів з одного домену на інший.

### Log (Журнал)
Представляє запис у журналі подій системи.

### Tag (Тег)
Представляє тег, який може бути присвоєний різним сутностям для їх категоризації.