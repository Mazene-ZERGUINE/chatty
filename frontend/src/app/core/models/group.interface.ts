import { User } from './user.interface';

export interface Group {
  id: string;

  groupName: string;

  description?: string;

  isActive: string;

  isPrivate: string;

  imageUrl: string;

  members: User[];
}
