import "reflect-metadata"
import { DataSource } from "typeorm"
import { Book } from "./entity/Book"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [Book],
    migrations: [],
    subscribers: [],
})