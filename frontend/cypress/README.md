# Testes E2E com Cypress

## Sobre

Este diretório contém os testes de aceitação (E2E) para a aplicação **Adote Fácil** usando Cypress.

## Estrutura de Testes

```
e2e/
├── 1-login.cy.ts              # Testes de autenticação e navegação
├── 2-register-animal.cy.ts    # Testes de cadastro de animal
└── 3-adopt-animal.cy.ts       # Testes de adoção de animal
```

## Testes Disponíveis

### 1. Testes de Login (1-login.cy.ts)

**Cenário Principal:**
- `CP1-01`: Login com credenciais válidas → Visualização de animais

**Cenários Alternativos:**
- `CA1-01`: Email com formato inválido → Erro de validação
- `CA1-02`: Senha incorreta → Erro de credenciais
- `CA1-03`: Senha muito curta → Erro de tamanho mínimo
- `CA1-04`: Link de cadastro visível e funcional

### 2. Testes de Cadastro de Animal (2-register-animal.cy.ts)

**Cenário Principal:**
- `CP2-01`: Cadastro completo com fotos → Redirecionamento para "Meus Animais"

**Cenários Alternativos:**
- `CA2-01`: Cadastro sem nome → Erro de validação
- `CA2-02`: Cadastro sem foto → Erro de validação
- `CA2-03`: Limite de fotos (máx 5) → Bloqueio de upload
- `CA2-04`: Descrição com limite de 300 caracteres
- `CA2-05`: Cadastro com campos opcionais vazios (Raça/Descrição)

### 3. Testes de Adoção (3-adopt-animal.cy.ts)

**Cenário Principal:**
- `CP3-01`: Visualizar animal → Confirmar adoção → Validar mudança de status

**Cenários Alternativos:**
- `CA3-01`: Visualizar detalhes completos do animal
- `CA3-02`: Voltar sem confirmar adoção → Animal permanece na lista
- `CA3-03`: Gerenciar animais em "Meus Animais"
- `CA3-04`: Filtrar animais por tipo/gênero
- `CA3-05`: Limpar filtros e retornar à lista completa

## Dados de Teste

Os testes utilizam um usuário de teste pré-cadastrado:

```
Email: usuario@teste.com
Senha: senha123456
```

Para popular estes dados, execute a seed do Prisma:

```bash
npx prisma db seed
```

ou crie manualmente via API:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuário Teste",
    "email": "usuario@teste.com",
    "password": "senha123456"
  }'
```

## Comandos Personalizados

O arquivo `support/e2e.ts` define o comando customizado:

```typescript
cy.login('usuario@teste.com', 'senha123456')
```

Este comando automatiza o fluxo de autenticação.

## Executando os Testes

Ver [documentacao/testes.md](../../documentacao/testes.md) para instruções completas.

**Resumo rápido:**

```bash
# Modo interativo
npm run cypress:open

# Modo headless (CI/CD)
npm run cypress:run

# Um teste específico
npm run cypress:run -- --spec "cypress/e2e/1-login.cy.ts"
```

## Troubleshooting

| Erro | Solução |
|------|---------|
| `Connection refused` | Verificar se frontend/backend estão rodando |
| `Element not found` | Aumentar timeout: `cy.get(..., { timeout: 10000 })` |
| `Login falha` | Verificar se usuário de teste existe no banco |
| `Imagem não carrega` | Verificar se arquivo de fixture existe |

## Debug

Para debugar um teste:

```bash
# Modo debug com passo a passo
npm run cypress:run -- --spec "cypress/e2e/1-login.cy.ts" --debug

# Ou no Cypress UI, clicar em "Inspect" para ver elementos do DOM
```

## Manutenção

- Atualizar seletores CSS sempre que o design mudar
- Manter dados de teste em sincronização com o banco
- Periodicamente validar que todos os testes ainda passam

