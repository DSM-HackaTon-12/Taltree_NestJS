import { Injectable } from '@nestjs/common';
import { CreateReviewReqeustDto } from './dto/request/createReview.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewEntity: Repository<Review>,
    @InjectRepository(User) private userEntity: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async createReview(
    postId: number,
    token: string,
    dto: CreateReviewReqeustDto,
  ) {
    const { user_id } = await this.userService.validateAccess(token);
    await this.reviewEntity.save({
      post_id: postId,
      writer_id: user_id,
      rating: dto.rating,
      content: dto.content,
    });
  }

  async getReview(postId: number) {
    const reviews = (
      await this.reviewEntity.find({
        where: { post_id: postId },
        relations: ['post', 'user'],
      })
    ).map((review) => {
      return {
        review_id: review.review_id,
        post: review.post,
        writer: review.user,
        rating: review.rating,
        content: review.content,
      };
    });

    return reviews;
  }
}
