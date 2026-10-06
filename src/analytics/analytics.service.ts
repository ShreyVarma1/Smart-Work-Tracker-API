import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { Todo, TodoDocument } from '../todos/schemas/todo.schema';
import { Comment, CommentDocument } from '../comments/schemas/comment.schema';
import { JpUser, JpUserDocument } from '../jp-users/schemas/jp-user.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    @InjectModel(JpUser.name) private readonly jpUserModel: Model<JpUserDocument>,
  ) {}

  // ── Part B: Basic Counts ─────────────────────────────────────────

  async getTotalUsers() {
    const result = await this.jpUserModel.aggregate([
      { $count: 'totalUsers' },
    ]);
    return result[0] ?? { totalUsers: 0 };
  }

  async getTotalPosts() {
    const result = await this.postModel.aggregate([
      { $count: 'totalPosts' },
    ]);
    return result[0] ?? { totalPosts: 0 };
  }

  async getTotalComments() {
    const result = await this.commentModel.aggregate([
      { $count: 'totalComments' },
    ]);
    return result[0] ?? { totalComments: 0 };
  }

  async getTotalTodos() {
    const result = await this.todoModel.aggregate([
      { $count: 'totalTodos' },
    ]);
    return result[0] ?? { totalTodos: 0 };
  }

  // ── Part C: Grouping ─────────────────────────────────────────────

  async getPostsPerUser() {
    return this.postModel.aggregate([
      {
        $group: {
          _id: '$userId',
          totalPosts: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          totalPosts: 1,
        },
      },
      { $sort: { userId: 1 } },
    ]);
  }

  async getTodosPerUser() {
    return this.todoModel.aggregate([
      {
        $group: {
          _id: '$userId',
          totalTodos: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          totalTodos: 1,
        },
      },
      { $sort: { userId: 1 } },
    ]);
  }

  async getCompletedVsIncompleteTodos() {
    return this.todoModel.aggregate([
      {
        $group: {
          _id: '$completed',
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          completed: '$_id',
          total: 1,
        },
      },
      { $sort: { completed: -1 } },
    ]);
  }

  // ── Part D: Filtering ────────────────────────────────────────────

  async getCompletedTodos() {
    return this.todoModel.aggregate([
      { $match: { completed: true } },
      {
        $project: {
          _id: 0,
          id: 1,
          userId: 1,
          title: 1,
          completed: 1,
        },
      },
    ]);
  }

  async getIncompleteTodos() {
    return this.todoModel.aggregate([
      { $match: { completed: false } },
      {
        $project: {
          _id: 0,
          id: 1,
          userId: 1,
          title: 1,
          completed: 1,
        },
      },
    ]);
  }

  async getPostsByUser(userId: number) {
    return this.postModel.aggregate([
      { $match: { userId } },
      {
        $project: {
          _id: 0,
          id: 1,
          userId: 1,
          title: 1,
          body: 1,
        },
      },
    ]);
  }

  // ── Part E: Sorting ──────────────────────────────────────────────

  async getUsersSortedAlphabetically() {
    return this.jpUserModel.aggregate([
      { $sort: { name: 1 } },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          username: 1,
          email: 1,
        },
      },
    ]);
  }

  async getPostsSortedByUserId() {
    return this.postModel.aggregate([
      { $sort: { userId: 1 } },
      {
        $project: {
          _id: 0,
          id: 1,
          userId: 1,
          title: 1,
        },
      },
    ]);
  }

  // ── Part F: Top Results ──────────────────────────────────────────

  async getFirstFiveUsers() {
    return this.jpUserModel.aggregate([
      { $sort: { id: 1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          username: 1,
          email: 1,
        },
      },
    ]);
  }

  async getTopFiveUsersByPosts() {
    return this.postModel.aggregate([
      {
        $group: {
          _id: '$userId',
          totalPosts: { $sum: 1 },
        },
      },
      { $sort: { totalPosts: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          totalPosts: 1,
        },
      },
    ]);
  }

  // ── Part G + H: $lookup + $unwind ────────────────────────────────

  async getPostsWithUserInfo() {
    return this.postModel.aggregate([
      {
        $lookup: {
          from: 'jp_users',
          localField: 'userId',
          foreignField: 'id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          id: 1,
          title: 1,
          userId: 1,
          user: {
            id: '$user.id',
            name: '$user.name',
            email: '$user.email',
          },
        },
      },
      { $sort: { id: 1 } },
    ]);
  }

  // ── Part I: Real Analytics ───────────────────────────────────────

  async getUserPostStats() {
    return this.postModel.aggregate([
      {
        $group: {
          _id: '$userId',
          totalPosts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'jp_users',
          localField: '_id',
          foreignField: 'id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$user.name',
          totalPosts: 1,
        },
      },
      { $sort: { totalPosts: -1 } },
    ]);
  }

  async getUserTodoStats() {
    return this.todoModel.aggregate([
      {
        $group: {
          _id: '$userId',
          totalTodos: { $sum: 1 },
          completedTodos: {
            $sum: { $cond: ['$completed', 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'jp_users',
          localField: '_id',
          foreignField: 'id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$user.name',
          totalTodos: 1,
          completedTodos: 1,
        },
      },
      { $sort: { userId: 1 } },
    ]);
  }

  async getUserCompletionPercentage() {
    return this.todoModel.aggregate([
      {
        $group: {
          _id: '$userId',
          totalTodos: { $sum: 1 },
          completedTodos: {
            $sum: { $cond: ['$completed', 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'jp_users',
          localField: '_id',
          foreignField: 'id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$user.name',
          totalTodos: 1,
          completedTodos: 1,
          completionPercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$completedTodos', '$totalTodos'] },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
      { $sort: { completionPercentage: -1 } },
    ]);
  }

  // ── Part K: Dashboard Summary ────────────────────────────────────

  async getDashboardSummary() {
    const [
      usersResult,
      postsResult,
      commentsResult,
      todosResult,
    ] = await Promise.all([
      this.jpUserModel.aggregate([{ $count: 'total' }]),
      this.postModel.aggregate([{ $count: 'total' }]),
      this.commentModel.aggregate([{ $count: 'total' }]),
      this.todoModel.aggregate([
        {
          $group: {
            _id: null,
            totalTodos: { $sum: 1 },
            completedTodos: {
              $sum: { $cond: ['$completed', 1, 0] },
            },
            pendingTodos: {
              $sum: { $cond: ['$completed', 0, 1] },
            },
          },
        },
      ]),
    ]);

    const todoStats = todosResult[0] ?? {
      totalTodos: 0,
      completedTodos: 0,
      pendingTodos: 0,
    };

    return {
      totalUsers: usersResult[0]?.total ?? 0,
      totalPosts: postsResult[0]?.total ?? 0,
      totalComments: commentsResult[0]?.total ?? 0,
      totalTodos: todoStats.totalTodos,
      completedTodos: todoStats.completedTodos,
      pendingTodos: todoStats.pendingTodos,
    };
  }

  // ── Part L: Bonus ────────────────────────────────────────────────

  async getTopThreeUsersByCompletedTodos() {
    return this.todoModel.aggregate([
      { $match: { completed: true } },
      {
        $group: {
          _id: '$userId',
          completedTodos: { $sum: 1 },
        },
      },
      { $sort: { completedTodos: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'jp_users',
          localField: '_id',
          foreignField: 'id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$user.name',
          completedTodos: 1,
        },
      },
    ]);
  }

  async getUsersWithMoreThanTenCompletedTodos() {
    return this.todoModel.aggregate([
      { $match: { completed: true } },
      {
        $group: {
          _id: '$userId',
          completedTodos: { $sum: 1 },
        },
      },
      { $match: { completedTodos: { $gt: 10 } } },
      {
        $lookup: {
          from: 'jp_users',
          localField: '_id',
          foreignField: 'id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$user.name',
          completedTodos: 1,
        },
      },
      { $sort: { completedTodos: -1 } },
    ]);
  }

  async getUserWithMostPosts() {
    const result = await this.postModel.aggregate([
      {
        $group: {
          _id: '$userId',
          totalPosts: { $sum: 1 },
        },
      },
      { $sort: { totalPosts: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'jp_users',
          localField: '_id',
          foreignField: 'id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$user.name',
          totalPosts: 1,
        },
      },
    ]);
    return result[0] ?? null;
  }

  async getAverageTodosPerUser() {
    const result = await this.todoModel.aggregate([
      {
        $group: {
          _id: '$userId',
          totalTodos: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          averageTodosPerUser: { $avg: '$totalTodos' },
        },
      },
      {
        $project: {
          _id: 0,
          averageTodosPerUser: { $round: ['$averageTodosPerUser', 2] },
        },
      },
    ]);
    return result[0] ?? { averageTodosPerUser: 0 };
  }

  async getFullAnalyticsSummary() {
    const [
      dashboard,
      topFiveUsers,
    ] = await Promise.all([
      this.getDashboardSummary(),
      this.getTopFiveUsersByPosts(),
    ]);

    return {
      ...dashboard,
      topFiveUsersByPosts: topFiveUsers,
    };
  }
}
