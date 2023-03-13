import { MigrationInterface } from "typeorm";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";

export class seeds1678664835758 implements MigrationInterface {
  public async up(): Promise<void> {
    const bookRepository = AppDataSource.getRepository(Book);
    const book = new Book();
    book.name = "Teste";
    book.author = "Teste";
    book.edition = 1;
    book.released = new Date().toLocaleDateString();
    book.created_at = new Date("3/12/2023, 8:10:13 PM");
    book.updated_at = new Date("3/12/2023, 8:10:13 PM");
    await bookRepository.save(bookRepository.create(book));
  }

  public async down(): Promise<void> {
    const bookRepository = AppDataSource.getRepository(Book);
    bookRepository.clear();
  }
}
