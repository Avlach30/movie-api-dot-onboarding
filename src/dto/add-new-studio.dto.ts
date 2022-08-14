import { IsInt } from 'class-validator';

export class AddMovieStudioDto {
  @IsInt()
  studio_number: number;

  @IsInt()
  seat_capacity: number;
}
