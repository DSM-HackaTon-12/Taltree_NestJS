import { Response } from 'express';
import { UserService } from './user.service';
import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.dto';
import { SignupRequestDto } from './dto/signup.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('mail')
  async sendMail(@Body('email') email: string, @Res() res: Response) {
    await this.userService.sendMail(email);

    return res.status(200).json('Ok').send();
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupRequestDto, @Res() res: Response) {
    await this.userService.signup(signupDto);

    return res.status(201).json('Created').send();
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginRequestDto,
    @Res() res: Response,
  ): Promise<object> {
    const data = await this.userService.login(loginDto);

    return res.status(200).json(data).send();
  }

  @Get('token')
  async validateRefresh(
    @Headers('Authorization') refreshToken: string,
    @Res() res: Response,
  ): Promise<object> {
    const data = await this.userService.validateRefresh(refreshToken);

    return res.status(200).json(data).send();
  }

  @Get('mypage')
  async getMyInfo(
    @Headers('Authorization') token: string,
    @Res() res: Response,
  ) {
    const data = await this.userService.getMyInfo(token);

    return res.status(200).json(data).send();
  }
}
