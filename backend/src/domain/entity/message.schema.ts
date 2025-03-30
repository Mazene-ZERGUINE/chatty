import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  senderId: number;

  @Prop({ required: true })
  receiverId: number;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  chatRoomId?: number;

  @Prop({ default: false })
  isGroupChat: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
