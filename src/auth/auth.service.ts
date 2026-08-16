import { Injectable, UnauthorizedException, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { AccountStatus } from '../enum/accountstatus.enum';
import { User } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';

import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);

    const isPasswordValid =
      !!user?.passwordHash &&
      (await bcrypt.compare(password, user?.passwordHash));

    if (user?.AcStatus !== AccountStatus.ACTIVE) {
      switch (user?.AcStatus) {
        case AccountStatus.INACTIVE:
          throw new UnauthorizedException(
            'Your account is inactive. Please contact the administrator.',
          );

        case AccountStatus.SUSPENDED:
          throw new UnauthorizedException(
            'Your account has been suspended. Please contact the administrator.',
          );

        case AccountStatus.DELETED:
          throw new UnauthorizedException(
            'Your account has been deleted. Please contact the administrator.',
          );

        case AccountStatus.PENDING:
          throw new UnauthorizedException(
            'Your account is pending activation. Please contact the administrator.',
          );

        default:
          throw new UnauthorizedException(
            `Your account status is ${user?.AcStatus}. Please contact the administrator.`,
          );
      }
    }
    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async login(email: string, password: string, res: Response): Promise<any> {
    const user = await this.validateUser(email, password);
    const newUser = {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      AcStatus: user.AcStatus,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const payload = {
      user: newUser,
    };

    const authToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });

    res.setHeader('x-auth-token', authToken);

    return {
      message: 'Login successful',
      user: newUser,
    };
  }
}
