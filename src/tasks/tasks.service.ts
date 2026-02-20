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

  create(createTaskDto: CreateTaskDto) {
    const newTask = this.tasksRepository.create(createTaskDto);
    return this.tasksRepository.save(newTask);
  }

  findAll() {
    return this.tasksRepository.find()
  }

  async findOne(id: number) {
    const task = await this.tasksRepository.findOne({ where: { id } })
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id)
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: number) {
    const task = await this.findOne(id)
    return this.tasksRepository.remove(task)
  }
}
