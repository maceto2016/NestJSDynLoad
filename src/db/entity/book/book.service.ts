import { Injectable } from '@nestjs/common';

export interface Book {
  id: number;
  title: string;
}

@Injectable()
export class BookService {
  private static _books: Array<Book> = [
    {
      id: 1,
      title: 'Nest.js: A Progressive Node.js Framework (English Edition)',
    },
    { id: 2, title: 'NestJS Build a RESTFul CRUD API' },
    { id: 3, title: 'Pratical Nest.js' },
  ];

  findById(id: number): Book {
    return BookService._books.find((book) => book.id === id);
  }
}
