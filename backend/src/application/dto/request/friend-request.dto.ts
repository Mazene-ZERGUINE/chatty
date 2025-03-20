import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { FriendRequestStatus } from '../../../domain/enum/friend-request-status.enum';
import { UserDto } from '../response/user.dto';

export class FriendRequestDto {
  @Expose()
  id: number;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @Transform(({ obj }) => obj.sender?.id) // Extract sender ID
  senderId: number;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @Transform(({ obj }) => obj.receiver?.id) // Extract receiver ID
  receiverId: number;

  @Expose()
  @Transform(
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    ({ value }) =>
      FriendRequestStatus[value as keyof typeof FriendRequestStatus],
  )
  requestStatus: FriendRequestStatus;
}

export class FriendRequestDetailsDto {
  @Expose()
  id: number;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @Type(() => UserDto)
  @Expose()
  sender: UserDto;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @Type(() => UserDto)
  @Expose()
  receiver: UserDto;

  @Expose()
  @Transform(
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    ({ value }) =>
      FriendRequestStatus[value as keyof typeof FriendRequestStatus],
  )
  requestStatus: FriendRequestStatus;
}

export class CreateFriendRequestDto {
  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}
