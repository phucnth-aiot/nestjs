import { Role } from 'src/common/enums/role.enum';

export class UserResponseDto {
  username: string;
  phone: string;
  email: string;
  role: Role;
  avatarUrl: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
