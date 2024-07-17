import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostRequestDto } from './dto/post.dto';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
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

  async readAllMyPost(token: string) {
    const { user_id } = await this.userService.validateAccess(token);

    return await this.postRepository.readAllMyPost(user_id);
  }

  async getPostDetail(token: string, postId: number) {
    await this.userService.validateAccess(token);

    const {
      writer_id,
      title,
      content,
      address,
      contact,
      start_date,
      end_date,
      image_url,
    } = await this.postRepository.findOnePost(postId);
    const writer = await this.userRepository.getMyInfo(writer_id);

    return {
      writer: {
        username: writer.username,
        profile: writer.profile_url,
        email: writer.email,
      },
      title,
      content,
      address,
      contact,
      startDate: start_date,
      endDate: end_date,
      img: image_url,
    };
  }

  async readAllMyAppliedPost(token: string) {
    const { user_id } = await this.userService.validateAccess(token);

    return await this.postRepository.readAllMyAppliedPost(user_id);
  }

  async readAllPostINeedToReviewToApplicant(token: string) {
    const { user_id } = await this.userService.validateAccess(token);

    return await this.postRepository.readAllPostINeedToReviewToApplicant(user_id);
  }
}
