import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";

const bookRepository = AppDataSource.getRepository(Book);

export async function allBooks(): Promise<Array<Book>> {
  const books = await bookRepository.find();
  return books;
}

export async function getBook(id: number): Promise<Book | null> {
  const book = await bookRepository.findOne({
    where: { id },
  });
  if (!book) {
    return null;
  }
  return book;
}

export async function createBook(payload: Partial<Book>): Promise<Book> {
  return await bookRepository.save(bookRepository.create(payload));
}

export async function updateBook(
  id: number,
  payload: Book
): Promise<Book | null> {
  const book = await bookRepository.findOne({
    where: { id },
  });
  if (!book) {
    return null;
  }
  book.name = payload.name ? payload.name : book.name;
  book.author = payload.author ? payload.author : book.author;
  book.released = payload.released ? payload.released : book.released;
  book.edition = payload.edition ? payload.edition : book.edition;
  await bookRepository.update(id, book);
  return book;
}

export async function deleteBook(id: number): Promise<Book | null> {
  const book = await bookRepository.findOne({
    where: { id },
  });
  if (!book) {
    return null;
  }
  await bookRepository.remove(book);
  return book;
}
