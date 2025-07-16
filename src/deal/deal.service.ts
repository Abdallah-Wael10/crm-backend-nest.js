import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deal, DealDocument } from './deal.schema';
import { CreateDealDto } from './dto/create-deal-dto';
import { UpdateDealDto } from './dto/update-deal-dto';
import { MailService } from '../mail/mail.service';
import { User, UserDocument } from '../users/users.schema';

@Injectable()
export class DealService {
  constructor(
    @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  async create(createDealDto: CreateDealDto): Promise<Deal> {
    const exists = await this.dealModel.findOne({ title: createDealDto.title });
    if (exists) throw new ConflictException('Deal title already exists');
    const created = new this.dealModel(createDealDto);
    const deal = await created.save();

    // Send email to user
    const user = await this.userModel.findById(deal.userId).exec();
    if (user && user.email) {
      await this.mailService.sendDealMail(user.email, {
        title: deal.title,
        amount: deal.amount,
        status: deal.status,
        customerId: deal.customerId,
      });
    }

    return deal;
  }

  async findAll(): Promise<Deal[]> {
    return this.dealModel.find().exec();
  }

  async findOne(id: string): Promise<Deal> {
    const deal = await this.dealModel.findById(id).exec();
    if (!deal) throw new NotFoundException('Deal not found');
    return deal;
  }

  async update(id: string, updateDealDto: UpdateDealDto): Promise<Deal> {
    const deal = await this.dealModel
      .findByIdAndUpdate(id, updateDealDto, { new: true })
      .exec();
    if (!deal) throw new NotFoundException('Deal not found');

    // Send email to user after update
    const user = await this.userModel.findById(deal.userId).exec();
    if (user && user.email) {
      await this.mailService.sendDealMail(user.email, {
        title: deal.title,
        amount: deal.amount,
        status: deal.status,
        customerId: deal.customerId,
      });
    }

    return deal;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.dealModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Deal not found');
    return { message: 'Deal deleted successfully' };
  }
}
