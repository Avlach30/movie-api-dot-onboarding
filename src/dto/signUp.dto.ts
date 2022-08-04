import { IsEmail, IsString, Length } from 'class-validator';

export class SignupDto {
  @IsString()
  @Length(5, 52)
  name: string;

  @IsEmail()
  @Length(2, 52)
  email: string;
}
