import { UserRole } from '../../users/users.entity';

export interface SafeUser {
  userId: number;
  username: string;
  role: UserRole;
}
