import { Body, Controller, Headers, Post, Res } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostRequestDto } from './dto/post.dto';
import { Response } from 'express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  async createPost(
    @Headers('Authorization') token: string,
    @Body() dto: CreatePostRequestDto,
    @Res() res: Response,
  ) {
    await this.postService.createPost(token, dto);

    return res.status(201).json('Created').send();
  }
}
