import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateTasksDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  assignedTo?: string; // optional for normal user, required for admin

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDateString()
  dueDate: Date;
}
