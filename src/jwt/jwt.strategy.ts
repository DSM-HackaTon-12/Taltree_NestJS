import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayloadDto } from 'src/user/dto/userPayload.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwt: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validateAccess(accessToken: string): Promise<UserPayloadDto> {
    const accesstoken = accessToken.split(' ')[1];
    console.log(accesstoken);

    const access = await this.jwt.verify(accesstoken, {
      secret: process.env.JWT_SECRET_ACCESS,
    });

    if (!access) throw new UnauthorizedException('리프레시 토큰 검증 필요');

    console.log(access);
    return access;
  }
}
