import { IsString, Length } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @Length(5, 255)
  title: string;

  @IsString()
  @Length(2, 255)
  overview: string;

  @IsString()
  @Length(2, 52)
  play_until: string;

  tags: Array<string>;
}
