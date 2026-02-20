import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Tasks (CRUD)')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tasks' })
  @ApiResponse({ status: 200, description: 'List of all tasks retrieved successfully.' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific task by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'The unique identifier of the task' })
  @ApiResponse({ status: 200, description: 'The requested task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiParam({ name: 'id', type: 'number', description: 'The unique identifier of the task to update' })
  @ApiResponse({ status: 200, description: 'The task has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    console.log('RECEIVED UPDATE DATA:', updateTaskDto);
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', type: 'number', description: 'The unique identifier of the task to delete' })
  @ApiResponse({ status: 200, description: 'The task has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}