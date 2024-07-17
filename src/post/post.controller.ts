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
    @Res() res: Response,
    @Body() dto: PostRequestDto,
    @Headers('Authorization') token: string,
  ) {
    await this.postService.createPost(token, dto);

    return res.status(201).json('Created').send();
  }

  @Patch('apply/:postId')
  async apply(
    @Headers('Authorization') token: string,
    @Param('postId') postId: string,
  ) {
    await this.postService.apply(token, Number.parseInt(postId));
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

  // 메인 페이지 글 목록 조회 (Home)
  @Get('mainpage')
  async readAllPost(
    @Res() res: Response,
    @Headers('Authorization') token: string,
  ) {
    return res
      .status(200)
      .json({ posts: await this.postService.readAllPost(token) })
      .send();
  }

  @Get('writed')
  async readAllMyPost(
    @Res() res: Response,
    @Headers('Authorization') token: string,
  ) {
    return res
      .status(200)
      .json({ posts: await this.postService.readAllMyPost(token) })
      .send();
  }

  @Get('/:postId')
  async getPostDetail(@Param('postId') postId: number) {
    return { post: await this.postService.getPostDetail(postId) };
  }
}
