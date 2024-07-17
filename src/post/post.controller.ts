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

  // 게시글 작성
  @Post('create')
  async createPost(
    @Res() res: Response,
    @Body() dto: PostRequestDto,
    @Headers('Authorization') token: string,
  ) {
    await this.postService.createPost(token, dto);

    return res.status(201).json('Created').send();
  }

  // 활동 신청
  @Patch('apply/:postId')
  async apply(
    @Headers('Authorization') token: string,
    @Param('postId') postId: string,
  ) {
    await this.postService.apply(token, Number.parseInt(postId));
  }

  // 게시글 수정
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

  // 내가 작성한 글 목록 조회
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

  // 내가 신청한 글 목록 조회
  @Get('applied')
  async readAllMyAppliedPost(
    @Res() res: Response,
    @Headers('Authorization') token: string,
  ) {
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6InNveWVvbmtpbTAyMjdAZHNtLmhzLmtyIiwiaWF0IjoxNzIxMjIxMDk3LCJleHAiOjE3MjEyMjgyOTd9.7wi1-rIG_GI-ApDWpnIrflWhYuDWAPQo0FoWDFXG_yY';
    return res
      .status(200)
      .json({ posts: await this.postService.readAllMyAppliedPost(token) })
      .send();
  }

  // 내가 참여자한테 리뷰해야 할 글 목록 조회
  @Get('review')
  async readAllPostINeedToReviewToApplicant(
    @Res() res: Response,
    @Headers('Authorization') token: string,
  ) {
    return res
      .status(200)
      .json({ posts: await this.postService.readAllPostINeedToReviewToApplicant(token) })
      .send();
  }

  // 게시글 상세 조회
  @Get('/:postId')
  async getPostDetail(
    @Param('postId') postId: number,
    @Headers('Authorization') token: string,
  ) {
    return { post: await this.postService.getPostDetail(token, postId) };
  }
}
