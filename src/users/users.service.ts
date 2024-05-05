import { HttpCode, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private hideUserPasswoerd(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const salt = bcrypt.genSaltSync(+process.env.CRYPT_SALT);
    const hash = bcrypt.hashSync(createUserDto.password, salt);
    createUserDto.password = hash;

    const user = await this.prisma.user.create({ data: createUserDto });
    return this.hideUserPasswoerd(user);
  }

  async findAll() {
    const allUsers = await this.prisma.user.findMany();
    return allUsers.map((user) => {
      return this.hideUserPasswoerd(user);
    });
  }

  async findOne(id: string) {
    const user = await this.getUserById(id);
    return this.hideUserPasswoerd(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: id },
      data: { ...updateUserDto },
    });

    if (!user) throw new NotFoundException('User not found.');

    return this.hideUserPasswoerd(user);
  }

  async remove(id: string) {
    const user = await this.prisma.user.delete({
      where: { id: id },
    });

    if (!user) throw new NotFoundException('User not found.');

    return null;
  }
}
