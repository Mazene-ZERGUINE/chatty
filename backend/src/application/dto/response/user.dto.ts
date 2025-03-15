import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  email: string;

  @Expose()
  bio?: string;

  @Expose()
  isActive: boolean;

  @Expose()
  avatarUrl: string;
}
