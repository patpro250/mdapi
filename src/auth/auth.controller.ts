import { Body, Controller, Post, Res } from '@nestjs/common';

import express from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return this.authService.login(loginDto.email, loginDto.password, res);
  }
}
