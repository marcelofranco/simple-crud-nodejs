import { HttpService } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Book } from './book.interface';


describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let httpService: HttpService;

  beforeEach(async () => {
    appService = new AppService(httpService);
    appService.url = "http://localhost:8080/"
    appController = new AppController(appService);
  });

  describe('/', () => {
    it('should return list of books', async () => {
      const book = {
        id: 1,
        name: "Teste",
        author: "Teste",
        edition: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
      } as Book;
      jest.spyOn(appService, 'findMyBook').mockResolvedValue(book);

      expect(await appController.getMyBook(1)).toEqual(book);
    });
  });
});
