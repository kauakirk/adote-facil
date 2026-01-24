# Arquitetura do Sistema

## 1. Arquitetura Adotada

O sistema adota uma arquitetura **Cliente-Servidor**, com separação clara entre backend e frontend, comunicando-se por meio de **API REST**.

### 1.1 Backend com Estrutura em Camadas

O backend é desenvolvido utilizando **Node.js** com **Express**. O acesso ao banco de dados **PostgreSQL** é realizado por meio do ORM **Prisma**.  
A autenticação é feita utilizando **JWT (JSON Web Token)** e o upload de imagens é tratado com **Multer**.

O backend é organizado seguindo uma **arquitetura em camadas**, promovendo separação de responsabilidades, incluindo:

- **Camada de Roteamento**: responsável por definir os endpoints da API.
- **Camada de Middlewares**: responsável por autenticação e validações.
- **Camada de Acesso a Dados**: abstraída pelo Prisma, responsável pela comunicação com o banco de dados.

Essa organização facilita a manutenção, escalabilidade e testabilidade do sistema.

### 1.2 Frontend

O frontend está localizado no diretório `frontend` e é desenvolvido com **Next.js (React)**.  
Ele consome as APIs do backend por meio de chamadas HTTP utilizando **Axios**.

Para validação de formulários, é utilizada a biblioteca **Zod**.  
O frontend é **desacoplado do backend**, executando em seu próprio **container Docker** e se comunicando exclusivamente por meio de **API REST**, o que garante maior flexibilidade e independência entre as camadas do sistema.
