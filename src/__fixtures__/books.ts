import { Book } from "../entity/Book";

export const allBooksEntry = (): Book[] => {
  const book1 = new Book();
  book1.id = 1;
  book1.name = "Test Book";
  book1.author = "Test Author";
  book1.released = "1975-03-10T01:54:25.645Z";
  book1.edition = 1;
  book1.created_at = new Date("2023-03-10T01:54:25.645Z");
  book1.updated_at = new Date("2023-03-10T01:54:25.645Z");
  const book2 = new Book();
  book2.id = 2;
  book2.name = "Test Book 2";
  book2.author = "Test Author 2";
  book2.released = "1985-03-10T01:54:25.645Z";
  book2.edition = 1;
  book2.created_at = new Date("2023-03-10T01:54:25.645Z");
  book2.updated_at = new Date("2023-03-10T01:54:25.645Z");
  const books = [book1, book2];
  return books;
};

export const allBooksOutput = {
  books: [
    {
      id: 1,
      name: "Test Book",
      author: "Test Author",
      edition: 1,
      released: "1975-03-10T01:54:25.645Z",
      created_at: "2023-03-10T01:54:25.645Z",
      updated_at: "2023-03-10T01:54:25.645Z",
    },
    {
      id: 2,
      name: "Test Book 2",
      author: "Test Author 2",
      edition: 1,
      released: "1985-03-10T01:54:25.645Z",
      created_at: "2023-03-10T01:54:25.645Z",
      updated_at: "2023-03-10T01:54:25.645Z",
    },
  ],
};

export const oneBookEntry = (): Book => {
  const book = new Book();
  book.id = 1;
  book.name = "Test Book";
  book.author = "Test Author";
  book.released = "1975-03-10T01:54:25.645Z";
  book.edition = 1;
  book.created_at = new Date("2023-03-10T01:54:25.645Z");
  book.updated_at = new Date("2023-03-10T01:54:25.645Z");
  return book;
};

export const oneBookOutput = {
  book: {
    id: 1,
    name: "Test Book",
    author: "Test Author",
    edition: 1,
    released: "1975-03-10T01:54:25.645Z",
    created_at: "2023-03-10T01:54:25.645Z",
    updated_at: "2023-03-10T01:54:25.645Z",
  },
};

export const updatedBookEntry = (): Book => {
  const book = new Book();
  book.id = 1;
  book.name = "Test Book";
  book.author = "Test Author";
  book.released = "1985-03-10T01:54:25.645Z";
  book.edition = 1;
  book.created_at = new Date("2023-03-10T01:54:25.645Z");
  book.updated_at = new Date("2023-03-10T01:54:25.645Z");
  return book;
};

export const updatedBookOutput = {
  book: {
    id: 1,
    name: "Test Book",
    author: "Test Author",
    edition: 1,
    released: "1985-03-10T01:54:25.645Z",
    created_at: "2023-03-10T01:54:25.645Z",
    updated_at: "2023-03-10T01:54:25.645Z",
  },
};
