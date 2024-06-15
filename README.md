## Description

[Qrdapio](https://github.com/users/RonaldoAntonucci/projects/5/views/1) Repositório da api do projeto.

## Docs
A documentação pode ser acessada rodando o projeto localmente.

[Swagger](http://localhost:3333/docs)

## Installation

```bash
$ npm install
$ npm run prepare
$ npx prisma generate
```
## Running with docker
no seu arquivo de terminal(ex: .bashrc, .zshrc) crie uma variavel para o usuário do docker
```bash
# run docker compose
$ docker compose up

# run migrations
$ npm run prisma:migrate:dev
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Ronaldo Antonucci](https://github.com/RonaldoAntonucci)