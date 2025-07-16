import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: String, ref: 'User' })
  assignedTo: string; // user id

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true, type: String, ref: 'User' })
  createdBy: string; // user id of creator
}

export const TaskSchema = SchemaFactory.createForClass(Task);
