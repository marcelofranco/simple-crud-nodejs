import { AppDataSource } from "./data-source";

/* eslint-disable */
const app = require("./app");

AppDataSource.initialize()
  .then(async () => {

    app.listen(8080, () => {
      console.log(
        "Server has started on port 8080. Open http://localhost:8080/books to see results"
      );
    });
  })
  .catch((error) => console.log(error));
