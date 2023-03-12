import "reflect-metadata";
import { DataSource } from "typeorm";
import { Book } from "./entity/Book";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "postgres",
  synchronize: false,
  logging: false,
  entities: [Book],
  migrations: [],
  subscribers: [],
});
