import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async findAll(
    status?: string,
    priority?: string,
    search?: string,
  ): Promise<Task[]> {
    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    return this.taskModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findOne({ id }).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskModel.create(createTaskDto);
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskModel
      .findOneAndUpdate(
        { id },
        updateTaskDto,
        { new: true },
      )
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    const task = await this.taskModel.findOneAndDelete({ id }).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return { message: 'Task deleted successfully' };
  }
}
