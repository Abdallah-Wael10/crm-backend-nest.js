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
import { DealService } from './deal.service';
import { CreateDealDto } from './dto/create-deal-dto';
import { UpdateDealDto } from './dto/update-deal-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/deals')
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Post()
  async create(@Body() createDealDto: CreateDealDto, @Request() req) {
    const userId = req.user.id || req.user._id || req.user.sub;
    return this.dealService.create({ ...createDealDto, userId });
  }

  @Get()
  async findAll() {
    return this.dealService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.dealService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto) {
    return this.dealService.update(id, updateDealDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.dealService.remove(id);
  }
}
