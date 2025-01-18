import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadService } from '../../shared/services/upload.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [UploadsController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadsModule {}
