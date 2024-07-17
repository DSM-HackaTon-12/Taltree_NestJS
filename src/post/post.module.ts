import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PostRepository } from './post.repository';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { Post } from './entity/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, UserService, UserRepository],
})
export class PostModule {}
