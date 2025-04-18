export interface User {
  id: string;

  firstName: string;

  lastName: string;

  phoneNumber: string;

  email: string;

  bio?: string;

  isActive: boolean;

  avatarUrl: string;

  contacts: User[];
}
