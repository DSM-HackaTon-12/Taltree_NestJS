import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/jwt/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
    PassportModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtStrategy],
})
export class UserModule {}
