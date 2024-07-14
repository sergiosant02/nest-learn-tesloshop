import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { fileLocater } from './helpers/fileLocater.helper';
import { fileNamer } from './helpers/fileNamer.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post(':folder')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: fileLocater,
        filename: fileNamer,
      }),
    }),
  )
  uploadFile(
    @Param('folder') folder: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.uploadFile(folder, file);
  }

  @Get(':folder/:imageName')
  async getFile(
    @Res() res: Response,
    @Param('folder') folder: string,
    @Param('imageName') imageName: string,
  ) {
    const path = await this.filesService.getStaticFile(folder, imageName);

    res.sendFile(path);
  }
}
