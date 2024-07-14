import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(folder: string, file: Express.Multer.File) {
    return {
      secureUrl: `${this.configService.get('HOST_API')}/files/${folder}/${
        file.filename
      }`,
    };
  }

  async getStaticFile(folder: string, imageName: string) {
    return join(__dirname, `../../static/${folder}`, imageName);
  }
}
