import * as request from "supertest";
import { QueryFailedError } from "typeorm";
import { Book } from "../../entity/Book";
import { HttpCode } from "../../exceptions/AppError";
import * as Repository from "../../repository/book.repository";
import {
  allBooksEntry,
  allBooksOutput,
  oneBookEntry,
  oneBookOutput,
  updatedBookEntry,
  updatedBookOutput,
} from "../../__fixtures__/books";

import app = require("../../app");

jest.mock("../../repository/book.repository");

describe("GET /books", () => {
  test("should return all books", (done) => {
    const mockAllBooks = jest.spyOn(Repository, "allBooks");
    mockAllBooks.mockResolvedValue(allBooksEntry());
    request(app)
      .get("/books")
      .expect(HttpCode.OK)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject(allBooksOutput);
        done();
      });
  });

  test("should not return any book", (done) => {
    const mockAllBooks = jest.spyOn(Repository, "allBooks");
    const books: Book[] = [];
    mockAllBooks.mockResolvedValue(books);
    request(app)
      .get("/books")
      .expect(HttpCode.NOT_FOUND)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          status: HttpCode.NOT_FOUND,
          message: "Book not found!",
        });
        done();
      });
  });
});

describe("GET /books/:id", () => {
  test("should return a books", (done) => {
    const mockOneBook = jest.spyOn(Repository, "getBook");
    mockOneBook.mockResolvedValue(oneBookEntry());
    request(app)
      .get("/books/1")
      .expect(HttpCode.OK)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject(oneBookOutput);
        done();
      });
  });

  test("should not return any book when doesnt exist", (done) => {
    const mockOneBook = jest.spyOn(Repository, "getBook");
    mockOneBook.mockResolvedValue(null);
    request(app)
      .get("/books/2")
      .expect(HttpCode.NOT_FOUND)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          status: HttpCode.NOT_FOUND,
          message: "Book not found!",
        });
        done();
      });
  });

  test("should not accept wrong id type", (done) => {
    request(app)
      .get("/books/a")
      .expect(HttpCode.BAD_REQUEST)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          status: HttpCode.BAD_REQUEST,
          message: "Invalid ID!",
        });
        done();
      });
  });
});

describe("POST /books", () => {
  test("should return a created a book", (done) => {
    const mockOneBook = jest.spyOn(Repository, "createBook");
    mockOneBook.mockResolvedValue(oneBookEntry());
    request(app)
      .post("/books")
      .send({
        name: "Test Book",
        author: "Test Author",
        edition: 1,
        released: "1975-03-10T01:54:25.645Z",
      })
      .expect(HttpCode.CREATED)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject(oneBookOutput);
        done();
      });
  });

  test("invalid request body", (done) => {
    const mockOneBook = jest.spyOn(Repository, "createBook");
    mockOneBook.mockResolvedValue(oneBookEntry());
    request(app)
      .post("/books")
      .send({
        author: "Test Author",
        edition: 1,
        released: "1975-03-10T01:54:25.645Z",
      })
      .expect(HttpCode.BAD_REQUEST)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          status: "fail",
          errors: [
            {
              code: "invalid_type",
              expected: "string",
              received: "undefined",
              path: ["body", "name"],
              message: "Name of the book is required",
            },
          ],
        });
        done();
      });
  });

  test("invalid request body invalid type", (done) => {
    const mockOneBook = jest.spyOn(Repository, "createBook");
    mockOneBook.mockResolvedValue(oneBookEntry());
    request(app)
      .post("/books")
      .send({
        name: 123,
        author: "Test Author",
        edition: 1,
        released: "1975-03-10T01:54:25.645Z",
      })
      .expect(HttpCode.BAD_REQUEST)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          status: "fail",
          errors: [
            {
              code: "invalid_type",
              expected: "string",
              received: "number",
              path: ["body", "name"],
              message: "Expected string, received number",
            },
          ],
        });
        done();
      });
  });

  test("should return a duplicated error", (done) => {
    const mockOneBook = jest.spyOn(Repository, "createBook");
    mockOneBook.mockImplementation(() => {
      throw new QueryFailedError("", undefined, { code: "23505" });
    });
    request(app)
      .post("/books")
      .send({
        name: "Test Book",
        author: "Test Author",
        edition: 1,
        released: "1975-03-10T01:54:25.645Z",
      })
      .expect(HttpCode.DUPLICATED)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          status: 409,
          message: "Books already registered",
        });
        done();
      });
  });
});

describe("PATCH /books", () => {
  test("should return an updated book", (done) => {
    const mockOneBook = jest.spyOn(Repository, "updateBook");
    mockOneBook.mockResolvedValue(updatedBookEntry());
    request(app)
      .patch("/books/1")
      .send({
        released: "1985-03-10T01:54:25.645Z",
      })
      .expect(HttpCode.OK)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject(updatedBookOutput);
        done();
      });
  });

  test("should not accept wrong id type", (done) => {
    request(app)
      .patch("/books/a")
      .expect(HttpCode.BAD_REQUEST)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          status: HttpCode.BAD_REQUEST,
          message: "Invalid ID!",
        });
        done();
      });
  });

  test("should not update any book when doesnt exist", (done) => {
    const mockOneBook = jest.spyOn(Repository, "updateBook");
    mockOneBook.mockResolvedValue(null);
    request(app)
      .patch("/books/2")
      .send({
        released: "1985-03-10T01:54:25.645Z",
      })
      .expect(HttpCode.NOT_FOUND)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          status: HttpCode.NOT_FOUND,
          message: "Book not found!",
        });
        done();
      });
  });
});

describe("DELETE /books", () => {
  test("should return succes on deleted book", (done) => {
    const mockOneBook = jest.spyOn(Repository, "deleteBook");
    mockOneBook.mockResolvedValue(updatedBookEntry());
    request(app)
      .delete("/books/1")
      .expect(HttpCode.NO_CONTENT)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual({});
        done();
      });
  });

  test("should not accept wrong id type", (done) => {
    request(app)
      .delete("/books/a")
      .expect(HttpCode.BAD_REQUEST)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          status: HttpCode.BAD_REQUEST,
          message: "Invalid ID!",
        });
        done();
      });
  });

  test("should not update any book when doesnt exist", (done) => {
    const mockOneBook = jest.spyOn(Repository, "deleteBook");
    mockOneBook.mockResolvedValue(null);
    request(app)
      .delete("/books/2")
      .expect(HttpCode.NOT_FOUND)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          status: HttpCode.NOT_FOUND,
          message: "Book not found!",
        });
        done();
      });
  });
});
