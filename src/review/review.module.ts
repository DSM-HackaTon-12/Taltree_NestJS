import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PostService } from 'src/post/post.service';
import { PostRepository } from 'src/post/post.repository';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { Post } from 'src/post/entity/post.entity';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Post, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [
    ReviewService,
    PostService,
    PostRepository,
    UserService,
    UserRepository,
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
