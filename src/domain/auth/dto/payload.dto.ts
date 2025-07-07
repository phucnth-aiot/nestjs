import { Role } from 'src/common/enums/role.enum';
export class PayloadDto {
  userid: string;
  username: string;
  role: Role;
  sub: string;
}
