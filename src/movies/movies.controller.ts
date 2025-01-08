import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Movie } from "./entity/movies.entity";
import { MoviesService } from "./movies.service";
import { CreateMovieDto } from "./dto/create-movie.dto";

@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}
  @Get()
  getAll(): Movie[] {
    return this.moviesService.getAll();
  }

  @Get(":id")
  getOne(@Param("id") movieId: number): Movie {
    const movies = this.moviesService.getOne(movieId);
    if (!movies) {
      throw new NotFoundException(`Movie with ID ${movieId} not found.`);
    }
    return movies;
  }

  @Post()
  create(@Body() movieData: CreateMovieDto) {
    return this.moviesService.create(movieData);
  }

  @Delete(":id")
  remove(@Param("id") movieId: number) {
    return this.moviesService.deleteOne(movieId);
  }

  @Patch(":id")
  patch(@Param("id") movieId: number, @Body() updateData) {
    return this.moviesService.update(movieId, updateData);
  }
}
