# CRUD em nodejs
Projeto de uma api (CRUD) em Nodejs com TypeScript, utilizando as seguintes libs/frameworks no desenvolvimento:
- [expressjs](https://expressjs.com/pt-br/)
- [typeorm](https://typeorm.io/)
- [pg](https://www.npmjs.com/package/pg)
- [zod](https://zod.dev/)

## Configurações
> **IMPORTANTE** O projeto está com apontamento local, não é recomendado para uso produtivo, para isso é necessário ocultar as informações de alguma forma, como por exemplo utilizando variáveis de ambiente com o [dotenv](https://github.com/motdotla/dotenv).

Para rodar o projeto é necessário ter instalado:
- [Node 18](https://nodejs.org/pt-br/download/) + [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker-compose](https://docs.docker.com/compose/install/)

Após instalação e configuração execute dentro da pasta do projeto:
```shell script
$ docker-compose up -d
[+] Running 2/2
 ⠿ Network simple-crud_default       Created                                                                                                                     0.1s
 ⠿ Container simple-crud-postgres-1  Started                                                                                                                     0.6s

$ yarn run start
yarn run v1.22.19
warning package.json: No license field
ts-node src/server.ts
Server has started on port 3000. Open http://localhost:3000/books to see results
```

## Pre-commit
Para realizar validações locais de qualidade de código foi utilizado o plugin [husky](https://typicode.github.io/husky/#/), o plugin foi configurado para que realizasse 3 validações antes do commit:


### **1.  Roda o [eslint](https://eslint.org/)**

Responsável por realizar validações estáticas no código, para que o eslint funcionasse no projeto foi utilizado o ferramental [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint), as regras utilizadas pelo eslint no projeto são as padrões.

No [eslint](https://eslint.org/) também foi configurado o [prettier](https://prettier.io/docs/en/install.html), assim o código segue um padrão de formatação evitando conflitos futuros no Git.


### **2. Roda o testes unitários**

Para garantir que os testes foram executados foi adicionado no pre-commit a execução dos testes unitários, sendo necessário um mínimo de cobertura para permitir o commit.
```json
"global": {
      "branches": 50,
      "functions": 100,
      "lines": 95,
      "statements": 95
    }
```

### **3. Valida a mensagem do commit**

Após as validações de código é verificado se a mensagem do commit segue o padrão de [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), impedindo a subida caso contrário.


## Testes

### Testes unitários
Todos testes unitários foram escritos utilizando o framework [jest](https://jestjs.io/), o mesmo foi utilizado para avaliar a cobertura. E todos se encontram dentro da respectivas pastas do código em teste.

As requisições dos endpoints nos testes foram realizadas utilizando a biblioteca [supertest](https://github.com/ladjs/supertest).

Para executar os testes unitários rodar:
```bash
yarn run test:unit
```

## Testes integrados

Os testes integrados assim como os unitários foram construídos com o [jest](https://jestjs.io/) e [supertest](https://github.com/ladjs/supertest).

Os testes se encontram na pasta 'test/integration', e não possuem um mínimo de cobertura definida.

Para melhorar a qualidade da entrega foi configurado no CI a execução dos testes integrados quando efetuado um PR. Porém não existe impedimento de colocar num pre-commit ou deixar disponível para execução local.

Para executar os testes integrados rodar:
```bash
yarn run test:integration
```
> **OBSERVAÇÃO** Para executar os testes integrados localmente é necessário inicializar a base de dados anteriormente.

## Testes de performance
