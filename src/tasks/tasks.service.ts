import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './tasks.schema';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import { MailService } from '../mail/mail.service';
import { User, UserDocument } from '../users/users.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  async create(
    createTasksDto: CreateTasksDto,
    createdBy: string,
  ): Promise<Task> {
    const created = new this.taskModel({
      ...createTasksDto,
      createdBy,
    });
    const task = await created.save();

    // Get assigned user's email
    const user = await this.userModel.findById(task.assignedTo).exec();
    if (user && user.email) {
      await this.mailService.sendTaskMail(user.email, {
        title: task.title,
        status: task.status,
        dueDate: task.dueDate,
      });
    }

    return task;
  }

  async findAll(userId: string, userRole: string): Promise<Task[]> {
    if (userRole === 'admin') return this.taskModel.find().exec();
    return this.taskModel.find({ assignedTo: userId }).exec();
  }

  async findOne(id: string, userId: string, userRole: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  async update(
    id: string,
    updateTasksDto: UpdateTasksDto,
    userId: string,
    userRole: string,
  ): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');

    Object.assign(task, updateTasksDto);
    return task.save();
  }

  async remove(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<{ message: string }> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');

    await task.deleteOne();
    return { message: 'Task deleted successfully' };
  }
} 
