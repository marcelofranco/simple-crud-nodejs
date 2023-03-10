import exp = require('constants');
import { Repository, UpdateResult } from 'typeorm';
import { Book } from '../../entity/Book';
import { allBooksEntry, oneBookEntry } from '../../__fixtures__/books';
import { allBooks, createBook, deleteBook, getBook, updateBook } from '../book.repository';

describe('allBooks', () => {
    test('should return list of books', () => {
        const mockRepository = jest.spyOn(Repository.prototype, 'find');
        mockRepository.mockResolvedValue(allBooksEntry())
        allBooks().then((books) => {
            expect(books.length).toEqual(2)
            expect(books[0].author).toEqual("Test Author")
            expect(books[1].author).toEqual("Test Author 2")
        })
    })
})

describe('getBook', () => {
    test('should return one book', () => {
        const mockRepository = jest.spyOn(Repository.prototype, 'findOne');
        mockRepository.mockResolvedValue(oneBookEntry())
        getBook(1).then((book) => {
            expect(book?.id).toEqual(1)
            expect(book?.author).toEqual("Test Author")
        })
    })

    test('should return null when book not found', async () => {
        const mockRepository = jest.spyOn(Repository.prototype, 'findOne');
        mockRepository.mockResolvedValue(undefined)
        const response = await getBook(1)
        expect(response).toEqual(null)
    })
})


describe('createBook', () => {
    test('should return one book when create success', () => {
        const createMockRepository = jest.spyOn(Repository.prototype, 'create');
        createMockRepository.mockResolvedValue(oneBookEntry())
        const saveMockRepository = jest.spyOn(Repository.prototype, 'save');
        saveMockRepository.mockResolvedValue(oneBookEntry())
        const b = new Book()
        b.name = "Test Book"
        b.author = "Test Author"
        b.released = "1975-03-10T01:54:25.645Z"
        b.edition = 1
        createBook(b).then((book) => {
            expect(book?.id).toEqual(1)
            expect(book?.author).toEqual("Test Author")
        })
    })
})

describe('updateBook', () => {
    test('should return one book when update success', () => {
        const findMockRepository = jest.spyOn(Repository.prototype, 'findOne');
        findMockRepository.mockResolvedValue(oneBookEntry())
        const updateMockRepository = jest.spyOn(Repository.prototype, 'update');
        updateMockRepository.mockResolvedValue(new UpdateResult)
        const b = new Book()
        b.released = "1975-03-10T01:54:25.645Z"
        updateBook(1, b).then((book) => {
            expect(book?.id).toEqual(1)
            expect(book?.author).toEqual("Test Author")
        })
    })

    test('should return null when book not found', async () => {
        const mockRepository = jest.spyOn(Repository.prototype, 'findOne');
        mockRepository.mockResolvedValue(undefined)
        const b = new Book()
        b.released = "1975-03-10T01:54:25.645Z"
        const response = await updateBook(1, b)
        expect(response).toEqual(null)
    })
})

describe('deleteBook', () => {
    test('should return removed book', () => {
        const findMockRepository = jest.spyOn(Repository.prototype, 'findOne');
        findMockRepository.mockResolvedValue(oneBookEntry())
        const removeMockRepository = jest.spyOn(Repository.prototype, 'remove');
        removeMockRepository.mockResolvedValue(oneBookEntry())
        deleteBook(1).then((book) => {
            expect(book?.id).toEqual(1)
        })
    })

    test('should return null when book not found', async () => {
        const mockRepository = jest.spyOn(Repository.prototype, 'findOne');
        mockRepository.mockResolvedValue(undefined)
        const b = new Book()
        b.released = "1975-03-10T01:54:25.645Z"
        const response = await deleteBook(2)
        expect(response).toEqual(null)
    })
})