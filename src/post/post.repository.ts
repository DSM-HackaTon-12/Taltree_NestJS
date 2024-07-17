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

  async updateApplier(post_id: number, applicant_id: number) {
    await this.postEntity.update({ post_id }, { applicant_id });
  }

  async readAllPost() {
    const posts = await this.postEntity
      .createQueryBuilder('post')
      .select([
        'post.post_id AS post_id',
        'post.title AS title',
        'post.address AS address',
        'post.start_date AS start_date',
        'post.end_date AS end_date',
        'post.image_url AS image_url',
      ])
      .where('ISNULL(post.applicant_id)')
      .orderBy('post.post_id', 'DESC')
      .getRawMany();

    return posts;
  }

  async readAllMyPost(user_id: number) {
    const posts = await this.postEntity
      .createQueryBuilder('post')
      .select([
        'post.post_id AS post_id',
        'post.title AS title',
        'post.address AS address',
        'post.start_date AS start_date',
        'post.end_date AS end_date',
        'post.image_url AS image_url',
      ])
      .where('post.writer_id = :writer_id', { writer_id: user_id })
      .orderBy('post.post_id', 'DESC')
      .getRawMany();

    return posts;
  }

  // 내가 신청한 게시글 목록 조회
  async readAllMyAppliedPost(user_id: number) {
    const posts = await this.postEntity
      .createQueryBuilder('post')
      .select([
        'post.post_id AS post_id',
        'post.title AS title',
        'post.address AS address',
        'post.start_date AS start_date',
        'post.end_date AS end_date',
        'post.image_url AS image_url',
      ])
      .where('post.applicant_id = :applicant_id', { applicant_id: user_id })
      .orderBy('post.post_id', 'DESC')
      .getRawMany();

    return posts;
  }
}
