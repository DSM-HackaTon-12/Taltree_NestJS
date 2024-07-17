import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { JwtService } from '@nestjs/jwt';
import { configDotenv } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from './dto/login.dto';
import { SignupRequestDto } from './dto/signup.dto';
import { UserPayloadDto } from './dto/userPayload.dto';
import { UserRepository } from './user.repository';

configDotenv();

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRedis() private readonly redis: Redis,
    private jwt: JwtService,
  ) {
    this.tranporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private tranporter: Mail;

  async sendMail(email: string) {
    const generateRandom = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const number = String(generateRandom(1, 999999)).padStart(6, '0');

    // 유효시간 5분
    await this.redis.set(email, number, 'EX', 60 * 5);

    const emailOptions: EmailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: '[Taltree] 인증 관련 메일',
      html: `인증번호 ${number}`,
    };

    await this.tranporter.sendMail(emailOptions);

    console.log({ number });
    return number;
  }

  private async verifyCode(email: string, code: string) {
    const getCode = await this.redis.get(email);
    if (Number(code) !== Number(getCode))
      throw new ConflictException('인증번호가 유효하지 않거나 일치하지 않음');

    return true;
  }

  async signup(signupDto: SignupRequestDto) {
    const { email, password, code } = signupDto;

    const existEmail = await this.userRepository.findUserByEmail(email);
    if (existEmail) throw new ConflictException('이미 존재하는 이메일');

    if (!(await this.verifyCode(email, code)))
      throw new ConflictException('인증번호 불일치 또는 만료');

    signupDto.password = await bcrypt.hash(password, 10);

    return await this.userRepository.createUser(signupDto);
  }

  async login(loginDto: LoginRequestDto): Promise<object> {
    const { email, password } = loginDto;

    const findUser = await this.userRepository.findUserByEmail(email);
    if (!findUser) throw new NotFoundException('존재하지 않는 이메일');

    const matchedPw = await bcrypt.compare(password, findUser.password);
    if (!matchedPw) throw new ConflictException('비밀번호 불일치');

    const payload = {
      user_id: findUser.user_id,
      email,
    };

    const access = await this.getAccessToken(payload);
    const refresh = await this.getRefreshToken(payload);

    await this.redis.set(`${email}-RefreshToken`, refresh);

    return {
      access,
      refresh,
    };
  }

  private async getAccessToken(userDto: UserPayloadDto): Promise<string> {
    const accessToken = await this.jwt.sign(userDto, {
      secret: process.env.JWT_SECRET_ACCESS,
    });

    return accessToken;
  }

  private async getRefreshToken(userDto: UserPayloadDto): Promise<string> {
    const refreshToken = await this.jwt.sign(userDto, {
      secret: process.env.JWT_SECRET_REFRESH,
      expiresIn: '1w',
    });

    return refreshToken;
  }

  async validateAccess(accesstoken: string): Promise<UserPayloadDto> {
    accesstoken = accesstoken.split(' ')[1];
    console.log(accesstoken);

    const access = await this.jwt.verify(accesstoken, {
      secret: process.env.JWT_SECRET_ACCESS,
    });

    if (!access) throw new UnauthorizedException('리프레시 토큰 검증 필요');

    console.log(access);
    return access;
  }

  async getMyInfo(token: string) {
    const { user_id } = await this.validateAccess(token);

    return await this.userRepository.getMyInfo(user_id);
  }
}
