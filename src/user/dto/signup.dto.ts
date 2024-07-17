import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupRequestDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
