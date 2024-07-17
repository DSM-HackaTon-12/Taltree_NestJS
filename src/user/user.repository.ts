import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupRequestDto } from 'src/user/dto/signup.dto';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userEntity: Repository<User>,
  ) {}

  async createUser(signupDto: SignupRequestDto) {
    const { email, username, password } = signupDto;

    const user = new User();

    user.email = email;
    user.username = username;
    user.password = password;

    const newUser = await this.userEntity.save(user);

    return newUser;
  }

//   async existsUser(userId: number): Promise<boolean> {
//     const existsUser = await this.userEntity.existsBy({ user_id: userId });

//     return existsUser;
//   }

  async findUserByEmail(email: string): Promise<User> {
    const existsEmail = await this.userEntity.findOneBy({ email });

    return existsEmail;
  }

  async getOneUser(userId: number): Promise<User> {
    const user = await this.userEntity
      .createQueryBuilder('qb')
      .select(['id', 'nickname', 'email', 'profileImageUrl', 'shortInform'])
      .where('qb.id = :userId', { userId })
      .getOne();

    return user;
  }
}