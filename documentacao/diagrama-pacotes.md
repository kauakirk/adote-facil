# Diagrama de Pacotes - Adote Fácil

```mermaid
graph TB
    subgraph Frontend["📦 FRONTEND"]
        direction TB
        FPages["Pages<br/>(Rotas)"]
        FComponents["Components<br/>(UI)"]
        FContext["Context<br/>(Estado Global)"]
        FAPI["API Client<br/>(Axios)"]
        FHelper["Helpers & Utils"]
        FAssets["Assets<br/>(Imagens, Ícones)"]
        
        FPages --> FComponents
        FPages --> FContext
        FPages --> FAPI
        FComponents --> FContext
        FComponents --> FHelper
    end
    
    subgraph Backend["📦 BACKEND"]
        direction TB
        BRoutes["Routes<br/>(Endpoints)"]
        BControllers["Controllers<br/>(Requisições)"]
        BServices["Services<br/>(Lógica de Negócio)"]
        BRepositories["Repositories<br/>(Acesso a Dados)"]
        BProviders["Providers<br/>(JWT, Encryptação)"]
        BConfig["Config<br/>(Multer)"]
        BMiddlewares["Middlewares<br/>(Autenticação)"]
        
        BRoutes --> BControllers
        BControllers --> BServices
        BControllers --> BMiddlewares
        BServices --> BRepositories
        BServices --> BProviders
        BRepositories --> BDB[(Prisma ORM)]
    end
    
    subgraph Database["📦 DATABASE"]
        direction TB
        DBSchema["Schema<br/>(Prisma)"]
        DBMigrations["Migrations"]
        PostgreSQL[(PostgreSQL)]
        
        DBSchema --> PostgreSQL
        DBMigrations --> PostgreSQL
    end
    
    subgraph Infra["📦 INFRAESTRUTURA"]
        direction TB
        Docker["Docker<br/>(Containerização)"]
        DockerCompose["Docker Compose<br/>(Orquestração)"]
    end
    
    FAPI -->|API REST<br/>JSON| BRoutes
    BDB -->|ORM| PostgreSQL
    Docker -.-> Frontend
    Docker -.-> Backend
    DockerCompose -->|Orquestra| Docker
    
    style Frontend fill:#4A90E2,color:#fff,stroke:#2E5C8A
    style Backend fill:#50C878,color:#fff,stroke:#2D7A4A
    style Database fill:#FFB84D,color:#fff,stroke:#CC8800
    style Infra fill:#9B59B6,color:#fff,stroke:#6C3A6F
