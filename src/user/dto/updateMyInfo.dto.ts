import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMyInfoRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  profile_url: string;
}
