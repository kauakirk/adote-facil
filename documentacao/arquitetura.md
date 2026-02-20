## 📌 Arquitetura

O **Adote Fácil** utiliza **arquitetura em camadas** no modelo **cliente-servidor**, com frontend e backend desacoplados e comunicação feita via **API REST**.

---

### 🖥 Backend

Organizado em 4 níveis principais:

- **Controllers** → recebem requisições HTTP e retornam respostas  
- **Services** → concentram as regras de negócio  
- **Repositories** → realizam acesso e abstração dos dados  
- **Banco de dados** → A aplicação utiliza ORM para acessar o PostgreSQL, facilitando manipulação dos dados.

**Stack principal:** Node.js, TypeScript, Express, JWT e Multer.

---

### 🌐 Frontend

- Desenvolvido com Next.js + React  
- Gerenciamento de estado com Context API  
- Validação de dados com Zod  
- Requisições HTTP com Axios  

---

### 🔗 Comunicação e Deploy

- Comunicação via HTTP/HTTPS com autenticação usando JWT  
- Containerização com **:contentReference[oaicite:1]{index=1}**

---

### ⚖️ Trade-offs da Arquitetura

**Vantagens**
- Melhor organização do código  
- Facilidade de manutenção  
- Melhor testabilidade  

**Desvantagens**
- Maior quantidade de código estrutural  
- Maior complexidade inicial
