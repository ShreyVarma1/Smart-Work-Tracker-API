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
    userId: string,
    status?: string,
    priority?: string,
    search?: string,
    assignee?: string,
    tags?: string,
  ): Promise<Task[]> {
    const filter: Record<string, unknown> = { userId };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (assignee) {
      filter.assignee = { $regex: assignee, $options: 'i' };
    }

    if (tags) {
      filter.tags = { $in: [tags] };
    }

    return this.taskModel.find(filter).exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ id, userId }).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    return this.taskModel.create({ ...createTaskDto, userId });
  }

  async updateTask(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskModel
      .findOneAndUpdate(
        { id, userId },
        updateTaskDto,
        { new: true },
      )
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async deleteTask(id: string, userId: string): Promise<{ message: string }> {
    const task = await this.taskModel.findOneAndDelete({ id, userId }).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return { message: 'Task deleted successfully' };
  }
}
