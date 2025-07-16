import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './customers.schema';
import { CreateCustomerDto } from './dto/create-customer';
import { UpdateCustomerDto } from './dto/update-customer';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto & { userId: string },
  ): Promise<Customer> {
    const exists = await this.customerModel.findOne({
      email: createCustomerDto.email,
    });
    if (exists) throw new ConflictException('Email already exists');
    const created = new this.customerModel(createCustomerDto);
    return created.save();
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerModel
      .findByIdAndUpdate(id, updateCustomerDto, { new: true })
      .exec();
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.customerModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Customer not found');
    return { message: 'Customer deleted successfully' };
  }
}
