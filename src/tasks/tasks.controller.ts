import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTasksDto: CreateTasksDto, @Request() req) {
    // user العادي: assignedTo = id بتاعه تلقائي
    const userId = req.user.id || req.user._id || req.user.sub;
    return this.tasksService.create(
      { ...createTasksDto, assignedTo: userId },
      userId,
    );
  }

  @Post('assign')
  @UseGuards(AdminGuard)
  async assignTask(@Body() createTasksDto: CreateTasksDto, @Request() req) {
    // admin: يختار assignedTo بنفسه
    const userId = req.user.id || req.user._id || req.user.sub;
    return this.tasksService.create(createTasksDto, userId);
  }

  @Get()
  async findAll(@Request() req) {
    return this.tasksService.findAll(
      req.user.id || req.user._id || req.user.sub,
      req.user.role,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(
      id,
      req.user.id || req.user._id || req.user.sub,
      req.user.role,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTasksDto: UpdateTasksDto,
    @Request() req,
  ) {
    return this.tasksService.update(
      id,
      updateTasksDto,
      req.user.id || req.user._id || req.user.sub,
      req.user.role,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(
      id,
      req.user.id || req.user._id || req.user.sub,
      req.user.role,
    );
  }
}
