import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from '../../shared/services/upload.service';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  private readonly logger = new Logger(UploadsController.name);

  constructor(private readonly uploadService: UploadService) {}

  @Post('products')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadProductImages(@UploadedFiles() files: Express.Multer.File[]) {
    this.logger.log(`Received files for upload: ${files?.length}`);

    try {
      if (!files || files.length === 0) {
        throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
      }

      // 檢查文件信息
      files.forEach((file, index) => {
        this.logger.debug(`File ${index + 1} info:`, {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        });
      });

      const urls = await this.uploadService.uploadFiles(files, 'products');
      this.logger.log(`Successfully uploaded ${urls.length} files`);

      return { urls };
    } catch (error) {
      this.logger.error('Upload error:', error);
      throw new HttpException(
        error.message || 'File upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('test')
  async testUpload() {
    try {
      await this.uploadService.testConnection();
      return { message: 'AWS S3 connection successful' };
    } catch (error) {
      this.logger.error('Test connection error:', error);
      throw new HttpException(
        'AWS S3 connection failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
