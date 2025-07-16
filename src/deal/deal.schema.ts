import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DealDocument = Deal & Document;

@Schema({ timestamps: true })
export class Deal {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, lowercase: true })
  amount: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true, type: String, ref: 'User' })
  userId: string; // The id of the user who created the Deal
  @Prop({ required: true, type: String, ref: 'Customer' })
  customerId: string; // The id of the customer associated with the Deal
}

export const DealSchema = SchemaFactory.createForClass(Deal);
 