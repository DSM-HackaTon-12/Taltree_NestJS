import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupRequestDto } from 'src/user/dto/signup.dto';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UpdateMyInfoRequestDto } from './dto/updateMyInfo.dto';

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

  async getMyInfo(user_id: number): Promise<User> {
    const user = await this.userEntity
      .createQueryBuilder('qb')
      .select(['user_id', 'username', 'email', 'profile_url'])
      .where('qb.user_id = :user_id', { user_id })
      .getRawOne();

    console.log(user);
    return user;
  }

  async update(user_id: number, dto: UpdateMyInfoRequestDto) {
    return this.userEntity.update(user_id, dto);
  }
}
