import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, UseGuards, Res, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, NotFoundException, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join, basename } from 'path';
import { createReadStream, existsSync } from 'fs';
import type { Response } from 'express';
import { FilesService } from './files.service';

@ApiTags("File Management")
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('files')
export class FilesController {
  constructor(private fileService: FilesService) { }
  @Post("upload")
  @ApiOperation({ summary: 'Upload a secure file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = crypto.randomUUID();
        const ext = extname(file.originalname);
        const cleanName = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-');
        callback(null, `${cleanName}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /^(image\/(png|jpe?g)|application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|wps-office\.docx))$/,
            skipMagicNumbersValidation: true,
          }),
        ]
      }),
    ) file: Express.Multer.File,
  ) {

    const savedFile = await this.fileService.saveFileMetaData(file)


    return {
      message: 'File uploaded successfully',
      id: savedFile.id,
      originalName: savedFile.originalName,
      downloadUrl: `http://localhost:3000/files/download/${savedFile.id}`,
    };
  }

  @Get('download/:id')
  @ApiOperation({ summary: 'Securely download a file by its database ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'The database ID of the file (e.g., 1)' })
  async downloadFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const fileRecord = await this.fileService.getFileById(+id);
    const filePath = join(process.cwd(), 'uploads', fileRecord.uniqueFilename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found or access denied.');
    }

    const fileStream = createReadStream(filePath);

    res.set({
      'Content-Type': fileRecord.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileRecord.originalName}"`,
    });

    return new StreamableFile(fileStream);
  }
}