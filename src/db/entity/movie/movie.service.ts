import { Injectable } from '@nestjs/common';

export interface Movie {
  id: number;
  title: string;
}

@Injectable()
export class MovieService {
  private static _movies: Array<Movie> = [
    {
      id: 1,
      title: 'Pirates of Silicon Valley (1999)',
    },
    { id: 2, title: 'Matrix (1999)' },
    { id: 3, title: 'Matrix Reloaded (2003)' },
  ];

  findById(id: number): Movie {
    return MovieService._movies.find((movie) => movie.id === id);
  }
}
