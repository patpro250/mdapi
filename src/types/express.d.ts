// src/types/express.d.ts

import { User } from '../user/entity/user.entity';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export {};
