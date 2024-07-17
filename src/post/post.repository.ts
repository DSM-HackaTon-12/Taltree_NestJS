import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { PostRequestDto } from './dto/post.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post) private readonly postEntity: Repository<Post>,
  ) {}

  async createPost(dto: PostRequestDto, writer_id: number) {
    const {
      title,
      content,
      address,
      contact,
      start_date,
      end_date,
      image_url,
    } = dto;

    const post = new Post();

    post.writer_id = writer_id;
    post.applicant_id = null;
    post.title = title;
    post.content = content;
    post.address = address;
    post.contact = contact;
    post.start_date = start_date;
    post.end_date = end_date;
    post.image_url = image_url;

    const newPost = await this.postEntity.save(post);

    return newPost;
  }

  async updatePost(dto: PostRequestDto, post_id: number) {
    return await this.postEntity.update(post_id, dto);
  }

  async findOnePost(post_id: number) {
    return await this.postEntity.findOneBy({ post_id });
  }
}
