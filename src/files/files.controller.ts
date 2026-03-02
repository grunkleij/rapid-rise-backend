import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, UseGuards, Res, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, NotFoundException, StreamableFile, UploadedFiles, Req } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
  @ApiOperation({ summary: 'Upload a secure file or multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Select one or more files to upload'
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('file', 10, {
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
    @Req() req: any,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /^(image\/(png|jpe?g|gif|webp)|text\/(plain|csv)|application\/(pdf|zip|x-zip-compressed|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|wps-office\.docx))$/,
            skipMagicNumbersValidation: true,
          }),
        ]
      }),
    ) files: Array<Express.Multer.File>,
  ) {
    console.log('JWT User Payload:', req.user);
    const userId = req.user.userId;

    const savedFile = await Promise.all(
      files.map(file => this.fileService.saveFileMetaData(file, userId))
    );


    return {
      message: `${files.length} file(s) uploaded successfully`,
      files: savedFile.map(savedFile => ({
        id: savedFile.id,
        originalName: savedFile.originalName,
        downloadUrl: `http://localhost:3000/files/download/${savedFile.id}`,
      }))
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

  @Get()
    @ApiOperation({ summary: 'Get a list of all files uploaded by the current user' })
    async getUserFiles(@Req() req: any) {
      const userId = req.user.id; 
      
      const files = await this.fileService.getFilesByUser(userId);

      return files.map(file => ({
        id: file.id,
        originalName: file.originalName,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, 
        mimeType: file.mimeType,
        uploadedAt: file.createdAt,
        downloadUrl: `http://localhost:3000/files/download/${file.id}`,
      }));
    }
}