#!/bin/bash -xe

docker-compose up -d
sleep 5s
export DB_HOST=localhost
cd ../../
yarn run typeorm migration:run -d src/data-source.ts 
cd extras/contract-test/
chmod +x ./pact_verifier_cli
./pact_verifier_cli -h localhost -p 8080 -f books-consumer/pacts/BooksConsumer-BooksProvider.json --json result.json || true
docker-compose down