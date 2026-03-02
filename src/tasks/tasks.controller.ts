import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
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
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    console.log(req.user)

    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException('Access denied: User ID is missing from token.');
    }

    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tasks' })
  @ApiResponse({ status: 200, description: 'List of all tasks retrieved successfully.' })
  findAll(@Req() req: any) {
    const userId = req.user.id || req.user.userId;
    ;
    return this.tasksService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific task by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'The unique identifier of the task' })
  @ApiResponse({ status: 200, description: 'The requested task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException('Access denied: User ID is missing from token.');
    }

    return this.tasksService.findOne(+id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiParam({ name: 'id', type: 'number', description: 'The unique identifier of the task to update' })
  @ApiResponse({ status: 200, description: 'The task has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req: any) {
    console.log('RECEIVED UPDATE DATA:', updateTaskDto);
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException('Access denied: User ID is missing from token.');
    }

    return this.tasksService.update(+id, updateTaskDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', type: 'number', description: 'The unique identifier of the task to delete' })
  @ApiResponse({ status: 200, description: 'The task has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException('Access denied: User ID is missing from token.');
    }

    return this.tasksService.remove(+id, userId);
  }
}