import { NextFunction, Request, Response } from "express";
import { Book } from "../entity/Book";
import { AppError, HttpCode } from "../exceptions/AppError";
import {
  allBooks,
  createBook,
  deleteBook,
  getBook,
  updateBook,
} from "../repository/book.repository";
import {
  CreateBookInput,
  DeleteBookInput,
  GetBookInput,
  UpdateBookInput,
} from "../schemas/book.schema";

export const all = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const books = await allBooks();

    if (books.length == 0) {
      throw new AppError({
        httpCode: HttpCode.NOT_FOUND,
        description: "Book not found!",
      });
    }

    response.status(HttpCode.OK).json({
      books,
    });
  } catch (err: any) {
    next(err);
  }
};
export const one = async (
  request: Request<GetBookInput>,
  response: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(request.params.bookId);
    if (isNaN(id)) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: "Invalid ID!",
      });
    }

    const book = await getBook(id);

    if (book == null) {
      throw new AppError({
        httpCode: HttpCode.NOT_FOUND,
        description: "Book not found!",
      });
    }

    response.status(HttpCode.OK).json({
      book,
    });
  } catch (err: any) {
    next(err);
  }
};

export const save = async (
  request: Request<never, never, CreateBookInput>,
  response: Response,
  next: NextFunction
) => {
  try {
    const resgisteredBook = await createBook(request.body);

    response.status(HttpCode.CREATED).json({
      book: resgisteredBook,
    });
  } catch (err: any) {
    if (err.code === "23505") {
      err = new AppError({
        httpCode: HttpCode.DUPLICATED,
        description: "Books already registered",
      });
    }
    next(err);
  }
};

export const update = async (
  request: Request<UpdateBookInput["params"], never, UpdateBookInput["body"]>,
  response: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(request.params.bookId);
    if (isNaN(id)) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: "Invalid ID!",
      });
    }

    const { name, author, released, edition } = request.body;

    const book = Object.assign(new Book(), {
      name,
      author,
      released,
      edition,
    });

    const updatedBook = await updateBook(id, book);

    if (updatedBook == null) {
      throw new AppError({
        httpCode: HttpCode.NOT_FOUND,
        description: "Book not found!",
      });
    }

    response.status(HttpCode.OK).json({
      book: updatedBook,
    });
  } catch (err: any) {
    next(err);
  }
};

export const remove = async (
  request: Request<DeleteBookInput>,
  response: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(request.params.bookId);
    if (isNaN(id)) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: "Invalid ID!",
      });
    }

    const bookToRemove = await deleteBook(id);

    if (bookToRemove == null) {
      throw new AppError({
        httpCode: HttpCode.NOT_FOUND,
        description: "Book not found!",
      });
    }

    response.status(HttpCode.NO_CONTENT).send();
  } catch (err: any) {
    next(err);
  }
};
