import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) { }

  create(createTaskDto: CreateTaskDto, userId : number) {
    const newTask = this.tasksRepository.create({...createTaskDto,
      userId : userId
    });
    return this.tasksRepository.save(newTask);
  }

  findAll(userId : number) {
    return this.tasksRepository.find({where : {userId}})
  }

  async findOne(id: number, userId : number) {
    const task = await this.tasksRepository.findOne({ where: { id, userId } })
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const task = await this.findOne(id,userId)
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: number, userId : number) {
    const task = await this.findOne(id, userId)
    return this.tasksRepository.remove(task)
  }
}
