import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../../domain/entity/message.schema';
import { Model } from 'mongoose';
import { CreateMessageDto } from '../dto/request/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const newMessage = new this.messageModel(createMessageDto);
    return newMessage.save();
  }

  async findMessagesBetweenUsers(
    user1Id: number,
    user2Id: number,
  ): Promise<Message[]> {
    return await this.messageModel
      .find({
        $or: [
          { senderId: user2Id, receiverId: user1Id },
          { senderId: user1Id, receiverId: user2Id },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();
  }

  async markMessagesAsRead(
    senderId: string,
    receiverId: string,
  ): Promise<void> {
    await this.messageModel.updateMany(
      {
        senderId: Number(senderId),
        receiverId: Number(receiverId),
        isRead: false,
      },
      { $set: { isRead: true } },
    );
  }
}
