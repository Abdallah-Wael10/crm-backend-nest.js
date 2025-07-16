import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDealDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  customerId: string; // Customer associated with the deal

  @IsString()
  @IsNotEmpty()
  userId: string; // User associated with the deal
}
