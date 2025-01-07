import { Body, Controller, Get, Param, Query } from '@nestjs/common';

@Controller('movies')
export class MoviesController {
  @Get()
  getAll() {
    return 'This will return all movies';
  }

  @Get('id')
  getOne(@Query('year')id:string, @Body() updateData) {
    return {
      updateData: id,
      ...updateData,
    };
  }
}
