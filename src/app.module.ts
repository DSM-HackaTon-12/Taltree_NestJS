import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ReviewModule } from './review/review.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDotenv } from 'dotenv';
import { RedisModule } from '@liaoliaots/nestjs-redis';

configDotenv();

@Module({
  imports: [
    UserModule,
    PostModule,
    ReviewModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/entity/*.js'],
      synchronize: true,
      logging: false,
      migrations: [__dirname + '/**/migrations/*.js'],
      migrationsTableName: 'migrations',
      autoLoadEntities: true,
      timezone: 'Asia/Seoul',
    }),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASS,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
