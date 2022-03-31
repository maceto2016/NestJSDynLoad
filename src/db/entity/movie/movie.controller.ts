import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { MovieService, Movie } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  getBook(@Query('id', ParseIntPipe) id: number): Movie {
    return this.movieService.findById(id);
  }
}
