import { PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from './createMovie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
