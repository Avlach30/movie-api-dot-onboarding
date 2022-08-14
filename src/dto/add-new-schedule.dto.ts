import { IsInt, IsString } from 'class-validator';

export class AddMovieScheduleDto {
  @IsInt()
  movie_id: number;

  @IsInt()
  studio_id: number;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

  @IsInt()
  price: number;

  @IsString()
  date: string;
}
