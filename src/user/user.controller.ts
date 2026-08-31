import {
  Body,
  Controller,
  Injectable,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AccountStatus } from '../enum/accountstatus.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Post('/appro/:id')
  // @UseGuards(AuthGuard('jwt'))
  async approveAccount(
    @Req() req: Request,

    @Body('status') Astatus: AccountStatus,
    @Param('id') id: string,
  ) {
    // const user = (req as CreateUserDto | any).user;
    // const status = user?.user?.AcStatus;
    // const Id = user?.user?.userId;

    return await this.userService.ApproveUser(id, Astatus);
  }
}
