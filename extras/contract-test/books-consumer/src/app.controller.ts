import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  validate
} from 'class-validator';
import { AppService } from './app.service';
import { Book } from './book.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("/:id")
  async getMyBook(@Param('id', new ParseIntPipe()) id): Promise<Book> {
    this.appService.url = "http://localhost:8080"
    const book = await this.appService.findMyBook(id);
    const bookInstance = plainToClass(Book, book);
    await validate(bookInstance).then(errors => {
      if (errors.length > 0) {
        throw new Error('Invalid Book!')
      }
    })
    return bookInstance;
  }
}
