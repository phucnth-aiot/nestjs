import { Request } from 'express';
import { SafeUser } from './safe-user.interface';

export interface RequestWithUser extends Request {
  user: SafeUser;
}
