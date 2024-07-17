import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class ImageService {
  private readonly s3;

  constructor() {
    AWS.config.update({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.s3 = new AWS.S3();
  }

  async uploadFiles(file: Express.Multer.File) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: String(file.originalname),
      Body: file.buffer,
      ACL: 'public-read',
    };

    try {
      const response = await this.s3.upload(params).promise();
      return response.Location;
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }
}
