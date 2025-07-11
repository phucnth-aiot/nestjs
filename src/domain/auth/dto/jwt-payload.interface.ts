import { Role } from 'src/common/enums/role.enum';
export interface JwtPayload {
  sub: string;
  username: string;
  role: Role;
}
