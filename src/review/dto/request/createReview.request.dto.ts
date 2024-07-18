import { IsNumber, IsString } from 'class-validator';

export class CreateReviewReqeustDto {
  @IsString()
  content: string;

  @IsNumber()
  rating: number;
}
