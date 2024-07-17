import { Injectable } from '@nestjs/common';
import { CreatePostRequestDto } from './dto/post.dto';
import { PostRepository } from './post.repository';
import { JwtStrategy } from 'src/jwt/jwt.strategy';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async createPost(token: string, dto: CreatePostRequestDto) {
    const { user_id } = await this.jwtStrategy.validateAccess(token);

    return await this.postRepository.createPost(dto, user_id);
  }
}
