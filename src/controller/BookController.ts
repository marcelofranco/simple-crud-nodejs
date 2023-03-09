import { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm/error/QueryFailedError";
import { AppDataSource } from '../data-source';
import { Book } from "../entity/Book";
import { AppError, HttpCode } from "../exceptions/AppError";
import { CreateBookInput, DeleteBookInput, GetBookInput, UpdateBookInput } from "../schemas/Book.schema";

const queryFailedGuard = (err: any): err is QueryFailedError & { code: string } => err instanceof QueryFailedError;

export class BookController {

    private bookRepository = AppDataSource.getRepository(Book)

    constructor() {
        this.all = this.all.bind(this);
        this.one = this.one.bind(this);
        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
    }

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const books = await this.bookRepository.find()

            if (books.length == 0) {
                throw new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: 'Book not found!',
                });
            }

            response.status(200).json({
                books
            });
        } catch (err: any) {
            next(err);
        }

    }

    async one(request: Request<GetBookInput>, response: Response, next: NextFunction) {
        try {
            const id = parseInt(request.params.bookId)
            if (isNaN(id)) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: 'Invalid ID!',
                });
            }

            const book = await this.bookRepository.findOne({
                where: { id }
            })

            if (!book) {
                throw new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: 'Book not found!',
                });
            }

            response.status(200).json({
                book
            });
        } catch (err: any) {
            next(err);
        }
    }

    async save(request: Request<{}, {}, CreateBookInput>, response: Response, next: NextFunction) {
        try {
            const { name, author, released, edition } = request.body;

            const book = Object.assign(new Book(), {
                name,
                author,
                released,
                edition
            })

            const resgisteredBook = await this.bookRepository.save(book)

            response.status(201).json({
                book: resgisteredBook,
            });
        } catch (err: any) {
            if (err.code === '23505') {
                throw new AppError({
                    httpCode: HttpCode.DUPLICATED,
                    description: 'Books already registered',
                });
            }
            next(err);
        }
    }

    async update(request: Request<UpdateBookInput['params'], {}, UpdateBookInput['body']>, response: Response, next: NextFunction) {
        try {
            const id = parseInt(request.params.bookId)
            if (isNaN(id)) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: 'Invalid ID!',
                });
            }

            const updatedBook = await this.bookRepository.findOne({
                where: { id }
            })

            if (!updatedBook) {
                throw new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: 'Book not found!',
                });
            }

            const { name, author, released, edition } = request.body;

            const book = Object.assign(new Book(), {
                name,
                author,
                released,
                edition
            })

            await this.bookRepository.update(id, book)

            updatedBook.name = name ? name : updatedBook.name
            updatedBook.author = author ? author : updatedBook.author
            updatedBook.released = released ? released : updatedBook.released
            updatedBook.edition = edition ? edition : updatedBook.edition

            response.status(200).json({
                book: updatedBook
            });
        } catch (err: any) {
            next(err);
        }
    }

    async remove(request: Request<DeleteBookInput>, response: Response, next: NextFunction) {
        try {
            const id = parseInt(request.params.bookId)
            if (isNaN(id)) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: 'Invalid ID!',
                });
            }

            let bookToRemove = await this.bookRepository.findOneBy({ id })

            if (!bookToRemove) {
                throw new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: 'Book not found!',
                });
            }

            await this.bookRepository.remove(bookToRemove)

            response.status(204).send();
        } catch (err: any) {
            next(err);
        }
    }

}