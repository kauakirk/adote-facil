# Detecção de Code Smells e Refatorações

Este documento demonstra que, através da ferramenta **ESLint**,
utilizando o **VS Code**, foi realizada uma análise no projeto **Adote
Fácil**, sendo possível identificar alguns pontos de *code smells*.

------------------------------------------------------------------------

## 1️⃣ Primeiro Code Smell

### 📌 Problema Encontrado

Função de middleware com parâmetro não utilizado (`next`), gerando
alerta do ESLint.

### 🔎 Trecho de Código Original

``` ts
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    console.error(err)
    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    })
  },
)
```

### ✅ Código Refatorado

``` ts
app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    console.error(err);
    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    });
  },
);
```

✔ Correção realizada: o parâmetro `next` foi renomeado para `_next`,
indicando explicitamente que ele não será utilizado, evitando o alerta
do ESLint.

------------------------------------------------------------------------

## 2️⃣ Segundo Code Smell

### 📌 Problema Encontrado

No início do TypeScript, os **namespaces** eram utilizados para
organização de código.\
Com a padronização dos **ES Modules** (`import` e `export`), namespaces
tornaram-se obsoletos e são considerados má prática em projetos
modernos.

### 🔎 Trecho de Código Original

``` ts
export namespace CreateAnimalDTO {
  export type Params = {
    name: string
    type: string
    gender: 'Macho' | 'Fêmea'
    race?: string
    description?: string
    userId: string
    pictures: Buffer[]
  }
}
```

### ✅ Código Refatorado

``` ts
export type CreateAnimalDTO = {
  name: string;
  type: string;
  gender: 'Macho' | 'Fêmea';
  race?: string;
  description?: string;
  userId: string;
  pictures: Buffer[];
};
```

✔ Correção realizada: remoção do `namespace` e exportação direta do
tipo, seguindo boas práticas modernas do TypeScript.

------------------------------------------------------------------------

## 3️⃣ Terceiro Code Smell

### 📌 Problema Encontrado

No bloco `catch (e)`, a variável `e` não era utilizada.\
O ESLint sinaliza isso para evitar variáveis desnecessárias no código.

### 🔎 Código Original

``` ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const isValidToken = (token: string | undefined): boolean => {
  if (!token) return false

  try {
    const decoded: { exp: number } = jwtDecode(token)
    return decoded.exp > Date.now() / 1000
  } catch (e) {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!isValidToken(token)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/area_logada/:path*'],
}
```

### ✅ Código Refatorado

``` ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const isValidToken = (token: string | undefined): boolean => {
  if (!token) return false

  try {
    const decoded: { exp: number } = jwtDecode(token)
    return decoded.exp > Date.now() / 1000
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!isValidToken(token)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/area_logada/:path*'],
}
```

✔ Correção realizada: remoção do parâmetro não utilizado no `catch`,
eliminando o alerta do ESLint e deixando o código mais limpo.

------------------------------------------------------------------------

# ✅ Conclusão

A utilização do **ESLint** foi essencial para identificar más práticas
(*code smells*) no projeto **Adote Fácil**, permitindo:

-   Melhor legibilidade do código
-   Adoção de boas práticas modernas do TypeScript
-   Redução de alertas e inconsistências
-   Código mais limpo e padronizado
