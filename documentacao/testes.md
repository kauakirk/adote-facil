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

Foram criados **4 testes principais**:

| Teste | Arquivo | O que testa |
|-------|---------|------------|
| Cadastro de Usuário | `cadastro-conta.cy.ts` | Criação de conta, validação de email e senha |
| Login com Sucesso | `1-login.cy.ts` | Autenticação e navegação pós-login |
| Login com Erro | `1-login.cy.ts` | Validação de credenciais inválidas |
| Cadastro de Animal | `animal.cy.ts` | Upload de foto, preenchimento de formulário e armazenamento |

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

### Estrutura dos Testes

```
frontend/cypress/
├── e2e/
│   ├── cadastro-conta.cy.ts
│   ├── 1-login.cy.ts
│   └── animal.cy.ts
└── fixtures/pet.webp
```

---