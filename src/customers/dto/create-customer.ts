import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[0-9+\-() ]{7,20}$/, { message: 'Invalid phone number' })
  phone: string;
}
