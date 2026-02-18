# Princípios e Padrões de Projeto

Este documento descreve os principais princípios SOLID e padrões de projeto identificados no backend do sistema **Adote Fácil**, desenvolvido em Node.js com Express, Prisma ORM e TypeScript.

---

## 1. Princípios SOLID aplicados no projeto

### Single Responsibility Principle (SRP)
O **Princípio da Responsabilidade Única** é amplamente aplicado no projeto. As classes possuem responsabilidades bem definidas, de acordo com sua função na arquitetura.

A separação entre Controllers, Services e Repositories garante que cada camada execute apenas uma tarefa específica:

- **Controllers:** lidam com requisições HTTP.
- **Services:** concentram a lógica de negócio.
- **Repositories:** realizam o acesso ao banco de dados.

Um exemplo claro é o service responsável pela criação de animais, cuja única função é executar o caso de uso de criação.

```typescript
export class CreateAnimalService {
  constructor(
    private readonly animalRepository: AnimalRepository,
    private readonly animalImageRepository: AnimalImageRepository,
  ) {}

  async execute(params) {
    const animal = await this.animalRepository.create(params)
    return animal
  }
}
```

### Open/Closed Principle (OCP)
De forma geral, o projeto respeita o **Princípio Aberto/Fechado**, pois novas funcionalidades podem ser adicionadas através da criação de novos services e controllers, sem a necessidade de alterar código já existente.

Por exemplo, para adicionar um novo caso de uso, basta criar um novo service, mantendo os demais intactos.

### Interface Segregation Principle (ISP)
O projeto apresenta pontos onde este princípio não é totalmente respeitado. Alguns services dependem de repositórios que expõem métodos que não são utilizados por aquele serviço específico.

Isso pode gerar dependências desnecessárias e indica uma possível melhoria futura, como a divisão dos repositórios em interfaces mais específicas por caso de uso.

### Dependency Inversion Principle (DIP)
O princípio da **Inversão de Dependência** é aplicado de forma parcial. Os services recebem seus repositórios via injeção no construtor, evitando que criem suas próprias dependências.

No entanto, essas dependências ainda são classes concretas, e não interfaces, o que caracteriza uma aplicação incompleta do DIP.

```typescript
export class UpdateAnimalStatusService {
  constructor(private readonly animalRepository: AnimalRepository) {}
}
```

---

## 2. Padrões de Projeto Utilizados

### Camada de Serviço (Service Layer)
A lógica de negócio do sistema está centralizada na camada de **Services**, responsável por orquestrar regras e operações da aplicação.

Exemplos:
* `CreateAnimalService`
* `CreateUserService`
* `UpdateAnimalStatusService`

Esse padrão evita controllers sobrecarregados e melhora a organização do código.

### Repository Pattern
O padrão **Repository** é utilizado para encapsular o acesso ao banco de dados e esconder os detalhes da persistência.

Os services interagem apenas com os repositórios, sem conhecer detalhes do Prisma ou do banco de dados.

```typescript
export class AnimalRepository {
  async create(data) {
    return prisma.animal.create({ data })
  }
}
```

### Singleton
O padrão **Singleton** é utilizado de forma prática no projeto, principalmente na criação de instâncias únicas de repositórios e do Prisma Client, evitando múltiplas conexões com o banco de dados.

```typescript
export const prisma = new PrismaClient()
```

---

## 3. Conclusão

O projeto **Adote Fácil** aplica de forma consistente princípios importantes de design, como o **SRP**, além de padrões amplamente utilizados como **Service Layer**, **Repository** e **Singleton**.

Apesar de existirem pontos de melhoria em relação a alguns princípios SOLID, a arquitetura adotada contribui para um código mais organizado, manutenível e fácil de evoluir.