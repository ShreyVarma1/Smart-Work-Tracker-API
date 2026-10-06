import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { PostsModule } from './posts/posts.module';
import { TodosModule } from './todos/todos.module';
import { CommentsModule } from './comments/comments.module';
import { JpUsersModule } from './jp-users/jp-users.module';
import { SeedModule } from './seed/seed.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // Existing modules
    TasksModule,
    UsersModule,
    AuthModule,
    ProductsModule,

    // New aggregation modules
    PostsModule,
    TodosModule,
    CommentsModule,
    JpUsersModule,
    SeedModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
