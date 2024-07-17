import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Response } from 'express';
import { PostRequestDto } from './dto/post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  async createPost(
    @Headers('Authorization') token: string,
    @Body() dto: PostRequestDto,
    @Res() res: Response,
  ) {
    await this.postService.createPost(token, dto);

    return res.status(201).json('Created').send();
  }

  @Patch('/:post_id')
  async updatePost(
    @Headers('Authorization') token: string,
    @Param('post_id') post_id: number,
    @Body() dto: PostRequestDto,
    @Res() res: Response,
  ) {
    await this.postService.updatePost(token, post_id, dto);

    return res.status(200).json('Ok').send();
  }

  @Patch('apply/:postId')
  async apply(
    @Headers('Authorization') token: string,
    @Param('postId') postId: string,
  ) {
    await this.postService.apply(token, Number.parseInt(postId));
  }

  // 메인 페이지 글 목록 조회 (Home)
  @Get('mainpage')
  async readAllPost(
    @Headers('Authorization') token: string,
    @Res() res: Response,
  ) {
    return res
      .status(200)
      .json({ posts: await this.postService.readAllPost(token) })
      .send();
  }

  @Get('/:postId')
  async getPostDetail(@Param('postId') postId: number) {
    return { post: await this.postService.getPostDetail(postId) };
  }
}
