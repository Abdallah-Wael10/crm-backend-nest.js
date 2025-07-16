import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DealController } from './deal.controller';
import { DealService } from './deal.service';
import { Deal, DealSchema } from './deal.schema';
import { MailModule } from '../mail/mail.module';
import { User, UserSchema } from '../users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Deal.name, schema: DealSchema },
      { name: User.name, schema: UserSchema },
    ]),
    MailModule,
  ],
  controllers: [DealController],
  providers: [DealService],
  exports: [DealService],
})
export class DealModule {}
