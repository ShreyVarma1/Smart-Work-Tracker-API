import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { Todo, TodoSchema } from '../todos/schemas/todo.schema';
import { Comment, CommentSchema } from '../comments/schemas/comment.schema';
import { JpUser, JpUserSchema } from '../jp-users/schemas/jp-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Todo.name, schema: TodoSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: JpUser.name, schema: JpUserSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
