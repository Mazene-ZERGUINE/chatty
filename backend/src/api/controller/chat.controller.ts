import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateMessageDto } from '../../application/dto/request/create-message.dto';
import { ChatService } from '../../application/service/chat.service';
import { Message } from '../../domain/entity/message.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateMessageDto): Promise<Message> {
    return this.chatService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':user1Id/:user2Id')
  async getChat(
    @Param('user1Id') user1Id: number,
    @Param('user2Id') user2Id: number,
  ): Promise<Message[]> {
    return await this.chatService.findMessagesBetweenUsers(user1Id, user2Id);
  }
}
