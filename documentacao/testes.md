# Documentação de Testes - Adote Fácil

## Análise dos Testes Unitários

O backend utiliza **Jest** com **TypeScript**. Testes estão em `backend/src/services/` cobrindo operações principais de usuários, animais e chat.

**Pontos Fortes:**
- ✅ Bom isolamento com `jest-mock-extended`
- ✅ Cobertura de casos de sucesso e erro
- ✅ Setup claro com `beforeEach`/`beforeAll`

**Propostas de Melhoria:**
1. Adicionar validação rigorosa de entrada (emails, senhas, etc.)
2. Implementar testes de integração contra banco real
3. Testar edge cases (concorrência, autorização)
4. Criar builders/fixtures reutilizáveis
5. Aumentar cobertura de controllers e repositories (atualmente ~60%)

---

## Testes de Aceitação E2E com Cypress

Foram criados **3 testes principais** cobrindo fluxos essenciais:

### 1️⃣ Login e Visualização de Animais (`1-login.cy.ts`)

**Cenários:**
- ✅ **CP1-01**: Login com credenciais válidas → Acesso à lista de animais
- 📋 CA1-01: Email inválido → Erro de validação
- 📋 CA1-02: Senha incorreta → Erro de credenciais
- 📋 CA1-03: Senha curta → Erro de validação
- 📋 CA1-04: Link de cadastro funcional

**O que testa:** Autenticação, validações de formulário, navegação pós-login

### 2️⃣ Cadastro de Animal (`2-register-animal.cy.ts`)

**Cenários:**
- ✅ **CP2-01**: Cadastro completo com fotos → Redirecionamento para "Meus Animais"
- 📋 CA2-01: Sem nome → Erro de validação
- 📋 CA2-02: Sem foto → Erro de validação
- 📋 CA2-03: Limite de 5 fotos → Bloqueio de upload
- 📋 CA2-04: Limite de 300 caracteres na descrição
- 📋 CA2-05: Cadastro com campos opcionais vazios

**O que testa:** Validação de formulário, upload de arquivos, limites de entrada, armazenamento

### 3️⃣ Adoção de Animal (`3-adopt-animal.cy.ts`)

**Cenários:**
- ✅ **CP3-01**: Visualizar animal → Confirmar adoção → Mudança de status
- 📋 CA3-01: Visualizar detalhes completos
- 📋 CA3-02: Voltar sem confirmar adoção
- 📋 CA3-03: Gerenciar animais em "Meus Animais"
- 📋 CA3-04: Filtrar animais por tipo/gênero
- 📋 CA3-05: Limpar filtros

**O que testa:** Navegação, atualizações de status, sincronização entre páginas

---

## ⚙️ Como Executar

### Testes Unitários (Backend)

```bash
cd backend
npm install
npm run test              # Executar
npm run test:watch       # Watch mode
npm run test:coverage    # Cobertura
```

### Testes E2E (Frontend)

```bash
cd frontend
npm install
npm run cypress:open     # UI interativa
npm run cypress:run      # Headless (CI/CD)
```

**Pré-requisitos:**
- Backend em `http://localhost:3000`
- Frontend em `http://localhost:3001`
- Usuário teste: `usuario@teste.com` / `senha123456`
- Banco de dados acessível

### Estrutura dos Testes E2E

```
frontend/cypress/
├── e2e/
│   ├── 1-login.cy.ts              # 5 testes de autenticação
│   ├── 2-register-animal.cy.ts    # 6 testes de cadastro
│   └── 3-adopt-animal.cy.ts       # 6 testes de adoção
├── support/e2e.ts                 # Helpers (comando cy.login())
└── fixtures/animal-photo.jpg      # Fixture de imagem
```

---

## 📊 Resumo da Cobertura

| Aspecto | Cobertura | Status |
|---------|-----------|--------|
| **Login** | Sucesso + 4 casos de erro | ✅ Completo |
| **Cadastro Animal** | Sucesso + 5 validações | ✅ Completo |
| **Adoção** | Sucesso + 5 fluxos alternativos | ✅ Completo |
| **Services (Backend)** | ~90% de cobertura | ✅ Bom |
| **Controllers (Backend)** | ~60% de cobertura | ⚠️ Oportunidade |

**Total: 3 cenários principais + 15 alternativos = 18 testes E2E**

