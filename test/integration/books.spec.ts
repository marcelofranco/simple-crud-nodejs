import * as request from "supertest";
import { Repository } from "typeorm";
import { AppDataSource } from "../../src/data-source";
import { Book } from "../../src/entity/Book";
import { HttpCode } from "../../src/exceptions/AppError";
import { allBooksEntry, oneBookEntry } from "../__fixtures__/books";

import app = require("../../src/app");

let bookRepository: Repository<Book>;

beforeAll(async () => {
    await AppDataSource.initialize()
    bookRepository = AppDataSource.getRepository(Book)
})

afterEach(async () => {
    bookRepository.clear()
})

afterAll(async () => {
    await AppDataSource.getRepository(Book).clear()
    await AppDataSource.destroy()
})

describe('GET /hc', () => {
    test('should return 200', async () => {
        const response = await request(app).get("/hc")
        expect(response.status).toEqual(HttpCode.OK)
        expect(response.body.message).toEqual('SUCCESS')
    })
})

describe('POST /books', () => {
    test('should return 201 and the created book information, and data should persist on database', (done) => {
        request(app)
            .post("/books")
            .send({
                "name": "Integration Book",
                "author": "Integration Author",
                "released": "1985-01-01T00:00:00.000Z",
                "edition": 1
            })
            .expect(HttpCode.CREATED)
            .end(async (err, res) => {
                if (err) return done(err);
                expect(res.body.book.name).toEqual("Integration Book");
                expect(res.body.book.author).toEqual("Integration Author");
                expect(res.body.book.released).toEqual("1985-01-01T00:00:00.000Z");
                expect(res.body.book.edition).toEqual("1");

                const bookId = parseInt(res.body.book.id)
                const book = await bookRepository.findOneBy({ id: bookId })
                if (!book) return done(new Error('book was not persisted at db'));
                expect(res.body.book.name).toEqual(book.name);
                expect(res.body.book.author).toEqual("Integration Author");
                expect(res.body.book.released).toEqual("1985-01-01T00:00:00.000Z");
                expect(res.body.book.edition).toEqual("1");
                done();
            });
    })
})


describe('GET /books', () => {
    test('should return 200 and list of books', async () => {
        const books = allBooksEntry()
        await bookRepository.save(books[0])
        await bookRepository.save(books[1])
        const response = await request(app).get("/books")
        expect(response.status).toEqual(HttpCode.OK)
        expect(response.body.books.length).toBeGreaterThanOrEqual(2)
    })
})


describe('GET /books/:id', () => {
    test('should return 200 and a book', async () => {
        const b = await bookRepository.save(oneBookEntry())
        const response = await request(app).get("/books/" + b.id)
        expect(response.status).toEqual(HttpCode.OK)
        expect(response.body.book.name).toEqual("Test Integration")
        expect(response.body.book.author).toEqual("Test Integration")
        expect(response.body.book.released).toEqual("1925-03-10")
        expect(response.body.book.edition).toEqual("2")
    })
})

describe('PATCH /books/:id', () => {
    test('should return 200 and the updated book', async () => {
        const b = await bookRepository.save(oneBookEntry())
        const response = await request(app).patch("/books/" + b.id)
            .send({
                name: "Updated Book"
            })
        expect(response.status).toEqual(HttpCode.OK)
        expect(response.body.book.name).toEqual("Updated Book")
        expect(response.body.book.author).toEqual("Test Integration")
        expect(response.body.book.released).toEqual("1925-03-10")
        expect(response.body.book.edition).toEqual("2")
    })
})

describe('DELETE /books/:id', () => {
    test('should return 204 and nothing in response, and book is deleted from db', async () => {
        const b = await bookRepository.save(oneBookEntry())
        const response = await request(app).delete("/books/" + b.id)
        expect(response.status).toEqual(HttpCode.NO_CONTENT)
        expect(response.body).toEqual({})
        const book = await bookRepository.findOneBy({ id: b.id })
        expect(book).toBeNull
    })
})