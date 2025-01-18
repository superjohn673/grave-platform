import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  private readonly s3: S3;
  private readonly logger = new Logger(UploadService.name);

  constructor(private configService: ConfigService) {
    this.logger.debug('初始化 AWS S3 設定');

    this.s3 = new S3({
      accessKeyId: this.configService.get('app.aws.accessKeyId'),
      secretAccessKey: this.configService.get('app.aws.secretAccessKey'),
      region: this.configService.get('app.aws.region'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<string> {
    try {
      this.logger.log(`開始上傳檔案: ${file.originalname}`);

      const key = `${folder}/${uuid()}-${encodeURIComponent(file.originalname)}`;
      const params = {
        Bucket: this.configService.get('app.aws.bucketName'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // 移除 ACL 設定
      };

      this.logger.debug('上傳參數:', {
        Bucket: params.Bucket,
        Key: params.Key,
        ContentType: params.ContentType,
      });

      const upload = await this.s3.upload(params).promise();
      this.logger.log(`檔案上傳成功: ${upload.Location}`);
      return upload.Location;
    } catch (error) {
      this.logger.error('S3 上傳錯誤:', error);
      throw error;
    }
  }

  async uploadFiles(
    files: Express.Multer.File[],
    folder: string = 'products',
  ): Promise<string[]> {
    try {
      this.logger.log(`開始上傳 ${files.length} 個檔案`);
      const uploadPromises = files.map((file) => this.uploadFile(file, folder));
      const urls = await Promise.all(uploadPromises);
      this.logger.log(`成功上傳 ${urls.length} 個檔案`);
      return urls;
    } catch (error) {
      this.logger.error('檔案上傳錯誤:', error);
      throw error;
    }
  }

  // 測試連線用的方法
  async testConnection() {
    try {
      const result = await this.s3.listBuckets().promise();
      this.logger.log('S3 連線測試成功:', result.Buckets);
      return result.Buckets;
    } catch (error) {
      this.logger.error('S3 連線測試失敗:', error);
      throw error;
    }
  }
}
