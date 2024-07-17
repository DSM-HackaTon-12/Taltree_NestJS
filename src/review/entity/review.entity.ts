import { Post } from 'src/post/entity/post.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @Column()
  post_id: number;

  @Column()
  writer_id: number;

  @Column()
  rating: number;

  @Column()
  content: string;

  @OneToOne(() => Post, (post) => post.review)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.review)
  @JoinColumn({ name: 'writer_id' })
  user: User;
}
