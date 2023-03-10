import { AppDataSource } from "./data-source";

const app = require("./app");

AppDataSource.initialize().then(async () => {

    app.listen(3000, () => {
        console.log("Server has started on port 3000. Open http://localhost:3000/books to see results");
    });


}).catch(error => console.log(error))