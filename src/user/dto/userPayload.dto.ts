import { IsNumber, IsString } from 'class-validator';

export class UserPayloadDto {
  @IsNumber()
  user_id: number;

  @IsString()
  email: string;
}