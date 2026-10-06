import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ── Part B: Basic Counts ─────────────────────────────────────────

  @Get('users')
  getTotalUsers() {
    return this.analyticsService.getTotalUsers();
  }

  @Get('posts')
  getTotalPosts() {
    return this.analyticsService.getTotalPosts();
  }

  @Get('comments')
  getTotalComments() {
    return this.analyticsService.getTotalComments();
  }

  @Get('todos')
  getTotalTodos() {
    return this.analyticsService.getTotalTodos();
  }

  // ── Part C: Grouping ─────────────────────────────────────────────

  @Get('posts-per-user')
  getPostsPerUser() {
    return this.analyticsService.getPostsPerUser();
  }

  @Get('todos-per-user')
  getTodosPerUser() {
    return this.analyticsService.getTodosPerUser();
  }

  @Get('todos-completion-status')
  getCompletedVsIncompleteTodos() {
    return this.analyticsService.getCompletedVsIncompleteTodos();
  }

  // ── Part D: Filtering ────────────────────────────────────────────

  @Get('todos/completed')
  getCompletedTodos() {
    return this.analyticsService.getCompletedTodos();
  }

  @Get('todos/incomplete')
  getIncompleteTodos() {
    return this.analyticsService.getIncompleteTodos();
  }

  @Get('posts/by-user/:userId')
  getPostsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.analyticsService.getPostsByUser(userId);
  }

  // ── Part E: Sorting ──────────────────────────────────────────────

  @Get('users/sorted')
  getUsersSortedAlphabetically() {
    return this.analyticsService.getUsersSortedAlphabetically();
  }

  @Get('posts/sorted-by-user')
  getPostsSortedByUserId() {
    return this.analyticsService.getPostsSortedByUserId();
  }

  // ── Part F: Top Results ──────────────────────────────────────────

  @Get('users/first-five')
  getFirstFiveUsers() {
    return this.analyticsService.getFirstFiveUsers();
  }

  @Get('users/top-by-posts')
  getTopFiveUsersByPosts() {
    return this.analyticsService.getTopFiveUsersByPosts();
  }

  // ── Part G+H: $lookup + $unwind ──────────────────────────────────

  @Get('posts/with-user-info')
  getPostsWithUserInfo() {
    return this.analyticsService.getPostsWithUserInfo();
  }

  // ── Part I: Real Analytics ───────────────────────────────────────

  @Get('user-posts')
  getUserPostStats() {
    return this.analyticsService.getUserPostStats();
  }

  @Get('user-todos')
  getUserTodoStats() {
    return this.analyticsService.getUserTodoStats();
  }

  @Get('user-completion-percentage')
  getUserCompletionPercentage() {
    return this.analyticsService.getUserCompletionPercentage();
  }

  // ── Part K: Dashboard ────────────────────────────────────────────

  @Get('dashboard')
  getDashboardSummary() {
    return this.analyticsService.getDashboardSummary();
  }

  // ── Part L: Bonus ────────────────────────────────────────────────

  @Get('bonus/top-three-completed')
  getTopThreeUsersByCompletedTodos() {
    return this.analyticsService.getTopThreeUsersByCompletedTodos();
  }

  @Get('bonus/users-more-than-ten-completed')
  getUsersWithMoreThanTenCompletedTodos() {
    return this.analyticsService.getUsersWithMoreThanTenCompletedTodos();
  }

  @Get('bonus/user-most-posts')
  getUserWithMostPosts() {
    return this.analyticsService.getUserWithMostPosts();
  }

  @Get('bonus/average-todos-per-user')
  getAverageTodosPerUser() {
    return this.analyticsService.getAverageTodosPerUser();
  }

  @Get('bonus/full-summary')
  getFullAnalyticsSummary() {
    return this.analyticsService.getFullAnalyticsSummary();
  }
}
