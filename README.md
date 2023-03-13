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


### **1.  Rodar o [eslint](https://eslint.org/)**

Responsável por realizar validações estáticas no código, para que o eslint funcionasse no projeto foi utilizado o ferramental [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint), as regras utilizadas pelo eslint no projeto são as padrões da ferramenta, a única regra desabilitada foi para uso do 'any': 
```json
"@typescript-eslint/no-explicit-any": [
      "off"
    ]
```

No [eslint](https://eslint.org/) também foi configurado o [prettier](https://prettier.io/docs/en/install.html), assim o código segue um padrão de formatação evitando conflitos futuros no Git.


### **2. Rodar os testes unitários**

Para garantir que os testes foram executados foi adicionado no pre-commit a execução dos testes unitários, sendo necessário um mínimo de cobertura para permitir o commit.
```json
"global": {
      "branches": 50,
      "functions": 100,
      "lines": 95,
      "statements": 95
    }
```

### **3. Validar a mensagem do commit**

Após as validações de código é verificado se a mensagem do commit segue o padrão de [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), impedindo a subida caso contrário.

Padronizando as mensagens do commit a construção de changelog ou documentação é simplificada, possibilitando a adição de uma ferramenta de auto versionamento, por exemplo.

## Healthcheck
Visto que a única dependência de funcionamento da aplicação é o banco de dados, foi adicionado um endpoint que verifica a disponibilidade da conexão e entidade do banco de dados, e responde indisponível quando não consegue estabeler a conexão.

Endpoint: __/hc__

Em caso de sucesso na conexão a resposta vem com o modelo:
```json
{
    "uptime": 4.382569764, // a quanto tempo que a api encontra-se disponível
    "message": "SUCCESS",
    "timestamp": 1678648889088 // momento que foi realizada a chamada do healthcheck
}
```

Em caso de falha na conexão a resposta vem com um status code 503 (Serviço indisponível).

## Testes

### Testes unitários
Todos testes unitários foram escritos utilizando o framework [jest](https://jestjs.io/), o mesmo foi utilizado para avaliar a cobertura. E todos se encontram dentro da respectivas pastas do código em teste.

As requisições dos endpoints nos testes foram realizadas utilizando a biblioteca [supertest](https://github.com/ladjs/supertest).

Para executar os testes unitários rodar:
```bash
yarn run test:unit
```

### Testes integrados
Os testes integrados assim como os unitários foram construídos com o [jest](https://jestjs.io/) e [supertest](https://github.com/ladjs/supertest).

Os testes se encontram na pasta 'test/integration', e não possuem um mínimo de cobertura definida.

Para melhorar a qualidade da entrega foi configurado no CI (Github Actions) a execução dos testes integrados quando efetuado um PR para a master. Porém não existe impedimento de colocar num pre-commit ou deixar disponível para execução local.

O arquivo de configuração da CI encontra-se na pasta:
__.github/workflows__

> **OBSERVAÇÃO** Para executar os testes integrados localmente é necessário inicializar a base de dados anteriormente com o docker-compose, ou criar uma base local.
Para executar os testes integrados localmente rodar:
```bash
yarn run test:integration
```

## EXTRAS

### Testes de performance
Como demonstrativo foi adicionado um testes de performance da aplicação na pasta "__extras/performance__", para executar os testes a aplicação foi instalada em um container.

É necessário o jmeter instalado na máquina para executar os testes.

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

### Testes de contrato
Como exemplo foi adicionado um teste de contrato utilizando o [pactjs](https://github.com/pact-foundation/pact-js), na pasta de "__extras/contract-test__".

Para exemplificar uma aplicação consumidora foi construída **books-consumer**, em seu único endpoint é realizado um fetch do endpoint **GET /books/:id** e uma validações propositalmente com erro afim de simular uma quebra de contrato.

A aplicação consumidora espera que o campo **edition** seja do tipo Number, e que as datas venham formatadas, porém a API **GET /books/:id** retorna o campo como string e as datas em outro formato.

O contrato é gerado no consumidor e é validado localmente com o provider utilizando a [pact_verifier_cli](https://docs.pact.io/implementation_guides/rust/pact_verifier_cli).

Para rodar o teste de contrato localmente foi adicionado um script shell:
```shell script
$ cd extras/contract-test
$ chmod +x pact-verifier.sh
$ ./pact-verifier.sh
```

Após a execução é gerado o resultado em um arquivo json "result.json".
```json
"actual": "{\"book\":{\"author\":\"Teste\",\"created_at\":\"2023-03-12T20:10:13.000Z\",\"deleted_at\":null,\"edition\":\"1\",\"id\":1,\"name\":\"Teste\",\"released\":\"2023-03-12\",\"updated_at\":\"2023-03-12T20:10:13.000Z\"}}",
"expected": "{\"author\":\"Teste\",\"created_at\":\"3/12/2023, 9:10:00 PM\",\"deleted_at\":null,\"edition\":1,\"id\":1,\"name\":\"Teste\",\"updated_at\":\"3/12/2023, 9:10:00 PM\"}",
```

## TODO
- Adicionar um padrão de logs para acompanhar a sanidade da aplicação
- Melhorar o endpoint de listagem geral (all)
- Adicionar o Broker do pact e automatizar as validações de contrato
