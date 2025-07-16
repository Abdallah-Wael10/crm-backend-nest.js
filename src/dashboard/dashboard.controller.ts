import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // لكل user: إحصائياته فقط
  @Get()
  async getMyStats(@Request() req) {
    const userId = req.user.id || req.user._id || req.user.sub;
    return this.dashboardService.getUserStats(userId);
  }

  // admin فقط: إحصائيات user محدد
  @Get(':id')
  @UseGuards(AdminGuard)
  async getUserStats(@Param('id') id: string) {
    return this.dashboardService.getUserStats(id);
  }

  // admin فقط: إحصائيات كل users
  @Get('admin/all')
  @UseGuards(AdminGuard)
  async getAllUsersStats() {
    return this.dashboardService.getAllUsersStats();
  }
}
