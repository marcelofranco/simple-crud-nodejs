# CRUD em nodejs
Projeto de uma api (CRUD) em Nodejs com TypeScript, utilizando as seguintes libs/frameworks no desenvolvimento:
- [expressjs](https://expressjs.com/pt-br/)
- [typeorm](https://typeorm.io/)
- [pg](https://www.npmjs.com/package/pg)
- [zod](https://zod.dev/)

## Configurações
> **IMPORTANTE** O projeto está com apontamento local, não é recomendado para uso produtivo, para isso é necessário ocultar as informações de conexões de algum modo, como por exemplo utilizando variáveis de ambiente com o [dotenv](https://github.com/motdotla/dotenv).

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
Server has started on port 8080. Open http://localhost:8080/books to see results
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

Para melhorar a qualidade da entrega foi configurado no CI (Github Actions) a execução dos testes integrados quando efetuado um PR para a master. Porém não existe impedimento de colocar num pre-commit ou deixar disponível para execução local.

O arquivo de configuração da CI encontra-se na pasta:
__.github/workflows__

Para executar os testes integrados localmente rodar:
```bash
yarn run test:integration
```
> **OBSERVAÇÃO** Para executar os testes integrados localmente é necessário inicializar a base de dados anteriormente com o docker-compose, ou criar uma base local.

Para executar os testes integrados rodar:
```bash
yarn run test:integration
```
> **OBSERVAÇÃO** Para executar os testes integrados localmente é necessário inicializar a base de dados anteriormente.

## Testes de performance
Como demonstrativo foi adicionado um testes de performance da aplicação na pasta "__extras/performance__", para executar os testes a aplicação foi instalada em um container.

É necessário o jmeter instalado na máquina para executar os testes, e é necessário alterar o arquivo de configuração da conexão com a base para o funcionamento no container.

Arquivo: __src/data-source.ts__
```typescript
...
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
...
```

Para rodar a aplicação execute:
```shell script
$ cd extras/performance
$ docker-compose up -d
```

Como teste a aplicação foi submetida a um teste de carga com os seguintes parametros:

- Máximo de usuários ativos: 1000
- Ramp-up (período para atingir o máximo de usuários): 200 segundos
- Duração do teste: 10 minutos

Resultados:

Como a aplicação não possui otimização de operações de READ/WRITE o throughput caiu com o avanço das requisições, e a média de tempo aumentou consideravelmente após o número máximo de usuários ativos ser atingido.

Além de não ter tratativas de paginação nem otimização no retorno de dados da listagem geral (GET /books).

 |  Request  |  #Samples  |  Avg  |  Min (ms)  |  Max (ms)  |  StdDev  |  Error (%)  |  Throughput   | Received KB/Sec  |  Sent KB/Sec  |  Abg. Bytes  | 
 |  -------  |  --------  |  ---  |  ---  |  ---  |  ------  |  -----  |  ----------  |  --------------  |  -----------  |  ----------  | 
 | HTTP Post /books  |  9965  |  18980  |  3  |  46589  |  14552.21  |  0.0  |  15.44/sec  |  7.11  |  4.76  |  471.77  | 
 | HTTP Get /books  |  9639  |  19802  |  1  |  47222  |  14907.46  |  0.0  |  14.93/sec  |  15408.08  |  1.77  |  1056291.36  | 
 | HTTP Get /books/:id  | 9271 | 19627 | 0  | 45878 | 14506.67 | 0.0 | 14.37/sec | 6.31 | 1.74 | 450.0 | 
 | TOTAL  | 28875 | 19462 | 0  | 47222 | 14661.61 | 0.0 | 44.74/sec | 15420.55 | 8.28 | 352916.55 | 


