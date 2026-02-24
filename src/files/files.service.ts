import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor (
    @InjectRepository(File)
    private fileRepository : Repository<File>,
  ){}

  async saveFileMetaData(file : Express.Multer.File, userId : number){
    const newFile = this.fileRepository.create({
      originalName : file.originalname,
      uniqueFilename : file.filename,
      mimeType : file.mimetype,
      size : file.size,
      userId : userId
    })

    return this.fileRepository.save(newFile);
  }

  async getFilesByUser(userId: number) {
    return this.fileRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' }, 
    });
  }

  async getFileById(id : number){
    const file = await this.fileRepository.findOne({where : {id}})
    if(!file) throw new NotFoundException(`File #${id} not found in database`);
    return file
  }

}
