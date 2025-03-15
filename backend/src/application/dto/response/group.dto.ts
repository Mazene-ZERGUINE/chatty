import { UserDto } from './user.dto';
import { Expose } from 'class-transformer';

export class GroupDto {
  @Expose()
  id: string;

  @Expose()
  groupName: string;

  @Expose()
  description?: string;

  @Expose()
  isActive: string;

  @Expose()
  isPrivate: string;

  @Expose()
  imageUrl: string;

  @Expose()
  members: UserDto[];
}
