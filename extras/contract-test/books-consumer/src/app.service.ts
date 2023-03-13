import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, lastValueFrom } from 'rxjs';
import { Book } from './book.interface';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private _url: string;
  constructor(private readonly httpService: HttpService) {
  }

  public set url(url: string) {
    this._url = url;
  }

  async findMyBook(id: number): Promise<Book> {
    const { data } = await lastValueFrom(
      this.httpService.get<Book>(this._url + '/books/' + id).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
