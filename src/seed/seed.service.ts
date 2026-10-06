import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { Todo, TodoDocument } from '../todos/schemas/todo.schema';
import { Comment, CommentDocument } from '../comments/schemas/comment.schema';
import { JpUser, JpUserDocument } from '../jp-users/schemas/jp-user.schema';

const JP_BASE = 'https://jsonplaceholder.typicode.com';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    @InjectModel(JpUser.name) private readonly jpUserModel: Model<JpUserDocument>,
  ) {}

  async seedAll(): Promise<{ message: string; counts: Record<string, number> }> {
    const counts: Record<string, number> = {};

    counts.users = await this.seedCollection(
      this.jpUserModel,
      `${JP_BASE}/users`,
      'jp_users',
    );

    counts.posts = await this.seedCollection(
      this.postModel,
      `${JP_BASE}/posts`,
      'posts',
    );

    counts.comments = await this.seedCollection(
      this.commentModel,
      `${JP_BASE}/comments`,
      'comments',
    );

    counts.todos = await this.seedCollection(
      this.todoModel,
      `${JP_BASE}/todos`,
      'todos',
    );

    return { message: 'Seed completed successfully', counts };
  }

  private async seedCollection<T>(
    model: Model<any>,
    url: string,
    label: string,
  ): Promise<number> {
    const existing = await model.countDocuments();

    if (existing > 0) {
      this.logger.log(`${label}: already has ${existing} documents — skipping`);
      return existing;
    }

    this.logger.log(`${label}: fetching from ${url}...`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const data: T[] = await response.json();

    await model.insertMany(data);

    this.logger.log(`${label}: inserted ${data.length} documents`);

    return data.length;
  }

  async getStatus(): Promise<Record<string, number>> {
    const [users, posts, comments, todos] = await Promise.all([
      this.jpUserModel.countDocuments(),
      this.postModel.countDocuments(),
      this.commentModel.countDocuments(),
      this.todoModel.countDocuments(),
    ]);

    return { users, posts, comments, todos };
  }

  async clearAll(): Promise<{ message: string }> {
    await Promise.all([
      this.jpUserModel.deleteMany({}),
      this.postModel.deleteMany({}),
      this.commentModel.deleteMany({}),
      this.todoModel.deleteMany({}),
    ]);

    return { message: 'All seed data cleared' };
  }
}
