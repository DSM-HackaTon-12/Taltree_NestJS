import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewReqeustDto } from './dto/request/createReview.request.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/:postId')
  async createReview(
    @Param('postId') postId: number,
    @Headers('Authorization') token: string,
    @Body() createReviewReqeustDto: CreateReviewReqeustDto,
  ) {
    await this.reviewService.createReview(
      postId,
      token,
      createReviewReqeustDto,
    );
  }

  @Get('/:postId')
  async getReviewList(@Param('postId') postId: number) {
    return { reviews: await this.reviewService.getReview(postId) };
  }
}
