import { IsString, IsNotEmpty, IsOptional, IsEnum, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(10, { message: 'Title must be at least 3 characters' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['pending', 'in-progress', 'completed'], {
    message: 'Status must be: pending, in-progress, or completed',
  })
  @IsOptional()
  status?: string;

  @IsEnum(['low', 'medium', 'high'], {
    message: 'Priority must be: low, medium, or high',
  })
  @IsOptional()
  priority?: string;
}
