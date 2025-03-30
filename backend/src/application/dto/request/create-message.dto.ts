import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  senderId: string;

  @IsNotEmpty()
  @IsNumber()
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  chatRoomId: string;

  @IsOptional()
  @IsBoolean()
  isGroupChat: boolean;
}
