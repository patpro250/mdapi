import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';
import { hashPassword } from '../lib/hashingPassword';
import { UserRole } from '../enum/userlore.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { AccountStatus } from '../enum/accountstatus.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const passwordHash = await hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      passwordHash,
      phone: createUserDto.phone,
      avatar: createUserDto.avatar,
      role: createUserDto.role,
      AcStatus: AccountStatus.PENDING,
    });

    return this.userRepository.save(user);
  }

  async ApproveUser(id: string, status: AccountStatus) {
    const exist = await this.userRepository.findOne({
      where: { id },
    });

    if (!exist) return new NotFoundException(' user not found');

    const pre = await this.userRepository.preload({
      id,
      AcStatus: status,
    });

    if (!pre) throw new Error('fail update status');

    return await this.userRepository.save(pre);
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUser(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
      delete updateUserDto.password;
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.update(id, { AcStatus: AccountStatus.DELETED });
  }
}
