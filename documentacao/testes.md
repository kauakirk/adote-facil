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

## Testes de Aceitação com Cypress

Foram criados **4 testes principais** cobrindo fluxos essenciais:

### 1️⃣ Cadastro de Usuário (`cadastro-conta.cy.ts`)

**Cenários:**
- ✅ **CP1-01**: Cadastro com sucesso → Redirecionamento para login

**O que testa:** Criação de conta, validação de email único, validação de confirmação de senha, armazenamento do usuário

**Teste implementado:**
```typescript
it('deve permitir que um novo usuário se cadastre com sucesso', () => {
  // Gera e-mail único com timestamp
  // Preenche nome, email e senha
  // Confirma senha
  // Verifica resposta 201 da API
  // Valida redirecionamento para /login
});
```

### 2️⃣ Login e Visualização de Animais (`1-login.cy.ts`)

**Cenários:**
- ✅ **CP2-01**: Login com credenciais válidas → Acesso à lista de animais
- ✅ **CP2-02**: Credenciais inválidas → Exibe alerta de erro

**O que testa:** Autenticação, validação de credenciais, navegação pós-login, tratamento de erros

**Testes implementados:**
```typescript
it('deve permitir que um usuário existente faça login com sucesso', () => {
  // Intercepta POST /login
  // Preenche email e senha válidos
  // Verifica resposta 200 ou 201
  // Valida redirecionamento para /area_logada/animais_disponiveis
});

it('deve exibir uma mensagem de erro ao usar credenciais inválidas', () => {
  // Intercepta evento de alerta
  // Preenche com credenciais inválidas
  // Verifica mensagem de erro: "Email ou senha inválidos."
});
```

### 3️⃣ Cadastro de Animal (`animal.cy.ts`)

**Cenários:**
- ✅ **CP3-01**: Cadastro completo com foto → Redirecionamento para "Meus Animais"

**O que testa:** Validação de formulário, upload de arquivos, seleção de dropdowns (tipo e gênero), armazenamento de animal

**Teste implementado:**
```typescript
it('deve permitir que um usuário logado cadastre um novo animal para adoção', () => {
  // Faz login primeiro
  // Navega para formulário de cadastro de animal
  // Preenche: nome, raça, descrição
  // Seleciona tipo (Cachorro) via dropdown
  // Seleciona gênero (Macho) via dropdown
  // Upload de arquivo (pet.webp)
  // Verifica resposta 201 da API
  // Valida redirecionamento para /area_logada/meus_animais
  // Confirma que animal aparece na lista
});
```

### Executar Testes

```bash
cd frontend
npm install
npm run cypress:open     # UI interativa
npm run cypress:run      # Headless (CI/CD)
```

**Pré-requisitos:**
- Frontend em `http://localhost:3000`
- Backend em `http://localhost:3001` (ou porta configurada)
- Usuário teste já cadastrado (via teste `cadastro-conta.cy.ts`) ou: `usuario@teste.com` / `senha123456`
- Banco de dados acessível
- Fixture de imagem: `cypress/fixtures/pet.webp`

### Estrutura dos Testes E2E

```
frontend/cypress/
├── e2e/
│   ├── cadastro-conta.cy.ts       # 1 teste de cadastro de usuário
│   ├── 1-login.cy.ts              # 2 testes de autenticação
│   └── animal.cy.ts               # 1 teste de cadastro de animal
├── support/e2e.ts                 # Configurações e helpers
└── fixtures/pet.webp              # Fixture de imagem para testes
```

---