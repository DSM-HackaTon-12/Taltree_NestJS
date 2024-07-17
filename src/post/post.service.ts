import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostRequestDto } from './dto/post.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
  ) {}

  async createPost(token: string, dto: PostRequestDto) {
    const { user_id } = await this.userService.validateAccess(token);

    return await this.postRepository.createPost(dto, user_id);
  }

  async updatePost(token: string, post_id: number, dto: PostRequestDto) {
    const { user_id } = await this.userService.validateAccess(token);

    const post = await this.postRepository.findOnePost(post_id);
    if (!post) throw new NotFoundException('Post Not Found');
    if (post.writer_id !== user_id)
      throw new ForbiddenException('글 작성자가 아님');

    return await this.postRepository.updatePost(dto, post_id);
  }

  async apply(token: string, postId: number) {
    const { user_id } = await this.userService.validateAccess(token);
    await this.postRepository.updateApplier(postId, user_id);
  }

  async readAllPost(token: string) {
    await this.userService.validateAccess(token);

    return await this.postRepository.readAllPost();
  }
}
