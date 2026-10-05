import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseUUIDPipe, HttpCode, HttpStatus, UseGuards, Request, } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
  ) {
    return this.tasksService.findAll(req.user.id, status, priority, search);
  }

  @Get(':id')
  findOne(
    @Request() req: any,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Post()
  createTask(
    @Request() req: any,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.createTask(createTaskDto, req.user.id);
  }

  @Patch(':id')
  updateTask(
    @Request() req: any,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, req.user.id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteTask(
    @Request() req: any,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.tasksService.deleteTask(id, req.user.id);
  }
}
