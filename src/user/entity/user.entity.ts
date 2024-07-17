import { Post } from 'src/post/entity/post.entity';
import { Review } from 'src/review/entity/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  profile_url: string;

  @OneToMany(() => Post, (post) => post.user, {
    onDelete: 'CASCADE',
  })
  posts: Post[];

  @OneToMany(() => Post, (post) => post.app_user, {
    onDelete: 'CASCADE',
  })
  app_post: Post[];

  @OneToMany(() => Review, (review) => review.user, {
    onDelete: 'CASCADE',
  })
  review: Review[];
}
