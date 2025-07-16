import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../customers/customers.schema';
import { Deal, DealDocument } from '../deal/deal.schema';
import { Task, TaskDocument } from '../tasks/tasks.schema';
import { User, UserDocument } from '../users/users.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getUserStats(userId: string) {
    const [
      totalCustomers,
      totalDeals,
      wonDeals,
      lostDeals,
      pendingDeals,
      openTasks,
      doneTasks,
    ] = await Promise.all([
      this.customerModel.countDocuments({ userId }),
      this.dealModel.countDocuments({ userId }),
      this.dealModel.countDocuments({ userId, status: 'won' }),
      this.dealModel.countDocuments({ userId, status: 'lost' }),
      this.dealModel.countDocuments({ userId, status: 'pending' }),
      this.taskModel.countDocuments({ assignedTo: userId, status: 'open' }),
      this.taskModel.countDocuments({ assignedTo: userId, status: 'done' }),
    ]);

    return {
      totalCustomers,
      totalDeals,
      wonDeals,
      lostDeals,
      pendingDeals,
      openTasks,
      doneTasks,
    };
  }

  async getAllUsersStats() {
    const users = await this.userModel
      .find()
      .select('_id username email')
      .exec();
    const stats = await Promise.all(
      users.map(async (user) => {
        const userStats = await this.getUserStats(String(user._id));
        return {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
          ...userStats,
        };
      }),
    );
    return stats;
  }
}
