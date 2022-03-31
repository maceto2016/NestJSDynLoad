import { Module } from '@nestjs/common';
import { BookModule } from './db/entity/book/book.module';
import { MovieModule } from './db/entity/movie/movie.module';

@Module({
  imports: [BookModule, MovieModule],
})
export class AppModule {}
