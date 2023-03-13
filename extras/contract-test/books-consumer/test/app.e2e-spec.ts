import { HttpService } from '@nestjs/axios';
import { MatchersV3, PactV3 } from '@pact-foundation/pact';
import { AppService } from '../src/app.service';
import path = require('path');

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'BooksConsumer',
  provider: 'BooksProvider',
});


const bookExample = [{
  id: 1,
  name: "Teste",
  author: "Teste",
  edition: 1,
  created_at: new Date().toLocaleString(),
  updated_at: new Date().toLocaleString(),
  deleted_at: null,
}];
const EXPECTED_BODY = MatchersV3.eachLike(bookExample);

describe('AppController (e2e)', () => {
  it('/:id (GET)', () => {
    provider
      .given('I have a book')
      .uponReceiving('a request for my book')
      .withRequest({
        method: 'GET',
        path: '/books/1',
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: EXPECTED_BODY,
      });

    return provider.executeTest(async (mockserver) => {
      let httpService: HttpService = new HttpService();
      let bookService = new AppService(httpService);
      bookService.url = mockserver.url;
      const response = await bookService.findMyBook(1)

      // Assert: check the result
      expect(response[0]).toEqual(bookExample);
    });
  });
});
