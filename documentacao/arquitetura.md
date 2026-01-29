# Arquitetura do Sistema

## 1. Visão Geral da Arquitetura

O projeto Adote Fácil adota uma **arquitetura em camadas (Layered Architecture)** com padrão **Cliente-Servidor**, onde backend e frontend são completamente desacoplados e se comunicam exclusivamente por **API REST**.

---

## 2. Arquitetura do Backend

### 2.1 Padrão de Arquitetura: Layered Architecture + Repository Pattern

O backend segue uma **arquitetura em camadas** com **3 camadas principais** + **camada de apresentação**:

```
┌─────────────────────────────────────┐
│     Camada de Apresentação          │
│  (Controllers) - Routes.ts          │
├─────────────────────────────────────┤
│     Camada de Negócios              │
│  (Services) - Lógica de aplicação   │
├─────────────────────────────────────┤
│     Camada de Persistência          │
│  (Repositories) - Acesso a dados    │
├─────────────────────────────────────┤
│     Camada de Dados                 │
│  (Prisma ORM) - PostgreSQL          │
└─────────────────────────────────────┘
```

#### **Responsabilidades de cada camada:**

1. **Camada de Apresentação (Controllers)**
   - Recebe requisições HTTP
   - Valida parâmetros de entrada
   - Retorna respostas HTTP apropriadas
   - Não contém lógica de negócios

2. **Camada de Negócios (Services)**
   - Implementa a lógica de aplicação
   - Coordena operações entre repositórios
   - Valida regras de negócio
   - Retorna resultados utilizando padrão Either (sucesso/erro)

3. **Camada de Persistência (Repositories)**
   - Abstrai o acesso ao banco de dados
   - Implementa operações CRUD
   - Utiliza Prisma como ORM
   - Define DTOs (Data Transfer Objects)

4. **Camada de Dados**
   - PostgreSQL como banco de dados relacional
   - Prisma como ORM para comunicação

### 2.2 Stack Tecnológico Backend

- **Runtime**: Node.js
- **Framework Web**: Express.js
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT (JSON Web Token)
- **Upload de Arquivos**: Multer
- **Linguagem**: TypeScript

### 2.3 Justificativa da Arquitetura em Camadas

**Vantagens:**
- ✅ **Separação de responsabilidades**: cada camada tem uma função específica
- ✅ **Testabilidade**: camadas podem ser testadas isoladamente
- ✅ **Manutenibilidade**: mudanças em uma camada não afetam as outras
- ✅ **Escalabilidade**: fácil adicionar novas funcionalidades
- ✅ **Compreensibilidade**: código mais organizado e legível

**Desvantagens:**
- ❌ Pode resultar em mais código boilerplate
- ❌ Potencial overhead de performance (múltiplas camadas)

---

## 3. Arquitetura do Frontend

### 3.1 Padrão: Component-Based Architecture

O frontend segue uma **arquitetura baseada em componentes**, típica de aplicações React/Next.js:

- **Framework**: Next.js (React)
- **Gerenciamento de Estado**: Context API (AnimalsContext)
- **Validação de Formulários**: Zod
- **HTTP Client**: Axios
- **Styling**: Sistema de temas customizado

### 3.2 Separação de Responsabilidades Frontend

- **Componentes**: Elementos reutilizáveis da UI
- **Pages**: Rotas da aplicação
- **Context**: Gerenciamento de estado global
- **API**: Camada de comunicação com backend
- **Helpers/Utils**: Funções utilitárias

---

## 4. Arquitetura Geral do Sistema

### 4.1 Topologia Cliente-Servidor

```
┌──────────────────────┐         ┌──────────────────────┐
│   Frontend (Next.js) │         │  Backend (Express)   │
│   - React Components │◄─────►  │  - Layered Arch      │
│   - Context API      │  REST   │  - Repositories      │
│   - Client-side UI   │  API    │  - Services          │
└──────────────────────┘         └──────────────────────┘
          ▲                                    ▲
          │                                    │
          │                                    │
       Docker                               Docker
       Container                            Container
                            │
                            ▼
                    ┌──────────────────┐
                    │   PostgreSQL     │
                    │   (Banco de Dados)│
                    └──────────────────┘
```

### 4.2 Comunicação

- Frontend e Backend se comunicam **exclusivamente via API REST**
- Cada aplicação roda em seu próprio **container Docker**
- Integração via **HTTP/HTTPS** com **JWT** para autenticação

---

## 5. Conclusão

O projeto utiliza uma **arquitetura em camadas bem definida no backend** combinada com **componentes reutilizáveis no frontend**, garantindo:

- Código limpo e organizado
- Fácil manutenção e testes
- Escalabilidade
- Separação clara entre frontend e backend
- Independência tecnológica entre as camadas
