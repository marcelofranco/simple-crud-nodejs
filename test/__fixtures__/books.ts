import { Book } from "../../src/entity/Book";

export const allBooksEntry = (): Book[] => {
  const book1 = new Book();
  book1.name = "Test Integration";
  book1.author = "Test Integration";
  book1.released = "1975-03-10T01:54:25.645Z";
  book1.edition = 1;
  const book2 = new Book();
  book2.name = "Test Integration 2";
  book2.author = "Test Integration 2";
  book2.released = "1985-03-10T01:54:25.645Z";
  book2.edition = 1;
  const books = [book1, book2];
  return books;
};

export const oneBookEntry = (): Book => {
  const book = new Book();
  book.name = "Test Integration";
  book.author = "Test Integration";
  book.released = "1925-03-10T01:54:25.645Z";
  book.edition = 2;
  return book;
};
