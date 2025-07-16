import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
