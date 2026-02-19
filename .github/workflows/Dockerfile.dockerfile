# Etapa 1: Build (Ambiente para compilação)
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl
WORKDIR /app

# Copia apenas arquivos de dependência primeiro para aproveitar cache do Docker
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante do código e executa os scripts de build
COPY . .
RUN npm run generate
RUN npm run build

# Etapa 2: Produção (Imagem final mais leve e segura)
FROM node:20-alpine

RUN apk add --no-cache openssl
WORKDIR /app

# Copia os arquivos de dependência novamente e instala APENAS pacotes de produção
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copia os arquivos gerados/compilados da Etapa 1
COPY --from=builder /app ./

# Boa prática: Usar usuário não-root por questões de segurança
USER node

EXPOSE 8080

CMD ["npm", "start"]