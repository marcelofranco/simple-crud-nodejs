import * as bodyParser from "body-parser"
import * as express from "express"
import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { AppError } from "./exceptions/AppError"
import bookRoutes from "./routes/Book.routes"


AppDataSource.initialize().then(async () => {

    const app = express()
    app.use(bodyParser.json())

    app.use('/books', bookRoutes);


    app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
        if (err.httpCode == undefined) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error!',
            });
        } else {
            res.status(err.httpCode).json({
                status: err.httpCode,
                message: err.message,
            });
        }
    });


    app.get('/hc', async (_, res: Response) => {
        res.status(200).json({
            status: 'success'
        });
    });

    app.listen(3000)

    console.log("Express server has started on port 3000. Open http://localhost:3000/books to see results")

}).catch(error => console.log(error))