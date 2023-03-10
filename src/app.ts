import * as bodyParser from "body-parser"
import * as express from "express"
import { NextFunction, Request, Response } from "express"
import { AppError, HttpCode } from "./exceptions/AppError"
import bookRoutes from "./routes/book.routes"


const app = express()

app.use(bodyParser.json())

app.use('/books', bookRoutes);

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    if (err.httpCode == undefined) {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
            status: HttpCode.INTERNAL_SERVER_ERROR,
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

module.exports = app;