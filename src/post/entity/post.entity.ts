import { Review } from 'src/review/entity/review.entity';
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
export class Post {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  writer_id: number;

  @Column({ nullable: true })
  applicant_id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  address: string;

  @Column()
  contact: string;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @Column()
  image_url: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'writer_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.app_post)
  @JoinColumn({ name: 'applicant_id' })
  app_user: User;

  @OneToOne(() => Review, (review) => review.post)
  review: Review;
}
