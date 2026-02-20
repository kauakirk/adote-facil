# Análise DevOps e Sugestões de Melhoria

Este documento consolida as análises e otimizações arquiteturais implementadas na esteira de Continuous Integration / Continuous Deployment (CI/CD) e nos manifestos de infraestrutura Docker do projeto **Adote Fácil**.

## 1. Melhorias no Dockerfile (Backend)
**Problemas Encontrados:**
O `Dockerfile` original apresentava o antipadrão de executar testes unitários (`npm run test`) durante a etapa de build da imagem, acoplando processos de CI dentro do container e aumentando o tempo de build. Além disso, a imagem final carregava dependências de desenvolvimento.

**Soluções Implementadas:**
* **Remoção dos Testes:** O comando de teste foi removido do manifesto Docker, delegando essa responsabilidade de forma isolada ao pipeline do GitHub Actions (Job `unit-test`).
* **Multi-stage Build:** O processo foi dividido em duas etapas (`builder` e imagem final). Isso reduziu drasticamente a superfície de ataque e o tamanho em disco da imagem em produção, já que a imagem final utiliza o parâmetro `--omit=dev`.
* **Segurança:** Inclusão da diretriz `USER node` para garantir que o container não seja executado com privilégios de `root`.

### Trecho de Dockerfile aplicado
```dockerfile
# backend/Dockerfile (resumido)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
# instala apenas dependências de produção na imagem final
RUN npm ci --omit=dev
# garante execução sem root
USER node
CMD ["node", "dist/server.js"]
```

> Observação: removemos a execução de `npm run test` do Dockerfile para que os testes rodem isoladamente no CI.

## 2. Orquestração e Dependências (docker-compose.yml)
**Problemas Encontrados:**
Embora o backend tivesse uma dependência condicional ao banco de dados (`service_healthy`), o serviço do frontend (`adote-facil-frontend`) inicializava baseado apenas no *start* do backend. Isso poderia causar falhas na UI por requisições enviadas antes de a API estar pronta para responder.

**Soluções Implementadas:**
* **Healthcheck do Backend:** Implementação de um `healthcheck` via `wget` na porta 8080 do serviço `adote-facil-backend`.
* **Espera Estratégica (Wait-for-it):** A dependência do frontend foi alterada de inicialização simples para `condition: service_healthy` em relação ao backend. A orquestração agora ocorre de forma resiliente: `Banco > (ok) > API > (ok) > Frontend`.

### Trecho de `docker-compose.yml` aplicado
```yaml
services:
  adote-facil-backend:
    build: ./backend
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:8080/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  adote-facil-frontend:
    build: ./frontend
    depends_on:
      adote-facil-backend:
        condition: service_healthy
```

## 3. Melhorias no Pipeline CI/CD (GitHub Actions)
**Problemas Encontrados:**
O tempo de execução do pipeline poderia ser comprometido pela instalação redundante de pacotes via rede. Havia também um erro de diretório no step de subida dos containers que faria o processo falhar ao buscar o manifesto `docker-compose.yml` na pasta errada.

**Soluções Implementadas:**
* **Implementação de Cache:** Uso da action oficial `actions/setup-node@v4` com cache configurado para pacotes `npm`, acelerando consideravelmente o step de `unit-test` em execuções subsequentes.
* **Instalação Limpa:** Substituição de `npm install` por `npm ci` para garantir previsibilidade e evitar mutações não intencionais na árvore de dependências (`package-lock.json`) durante o CI.
* **Correção de Path:** O diretório de execução no passo `Subir containers com Docker Compose` foi ajustado para a raiz do projeto.
* **Otimização do Delivery:** O comando de empacotamento (`zip`) foi aprimorado para ignorar pastas `node_modules` locais de subdiretórios, gerando um artefato infinitamente mais leve.

### Trechos do GitHub Actions aplicados
```yaml
# Exemplo resumido de job (workflow)
- uses: actions/setup-node@v4
  with:
    node-version: 18
    cache: 'npm'

- name: Install dependencies
  run: npm ci

- name: Run unit tests
  run: npm test

# Passo corrigido para subir o docker-compose a partir da raiz do repositório
- name: Subir containers com Docker Compose
  working-directory: ${{ github.workspace }}
  run: |
    docker compose -f docker-compose.yml up --build -d

# Criação de artefato evitando incluir node_modules
- name: Create artifact
  run: |
    zip -r adote-facil.zip . -x "*/node_modules/*" "backend/node_modules/*" "frontend/node_modules/*"
```

---
