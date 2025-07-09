import * as dotenv from 'dotenv';

dotenv.config();
export const jwtConstants = {
  accessSecret: process.env.JWT_SECRET as string,
};
