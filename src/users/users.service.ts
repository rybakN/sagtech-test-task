import { HttpCode, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private deletePasswordFromUser(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const salt = bcrypt.genSaltSync(+process.env.CRYPT_SALT);
    const hash = bcrypt.hashSync(createUserDto.password, salt);
    createUserDto.password = hash;

    try {
      return await this.prisma.user.create({ data: createUserDto });
    } catch (e) {
      return e;
    }
  }

  async findAll() {
    const allUsers = await this.prisma.user.findMany();
    return allUsers.map((user) => {
      return this.deletePasswordFromUser(user);
    });
  }

  async findOne(id: string) {
    const user = await this.getUser(id);
    return this.deletePasswordFromUser(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: id },
      data: { ...updateUserDto },
    });

    if (!user) throw new NotFoundException('User not found.');

    return this.deletePasswordFromUser(user);
  }

  async remove(id: string) {
    const user = this.prisma.user.delete({
      where: { id: id },
    });

    if (!user) throw new NotFoundException('User not found.');

    return HttpCode(204);
  }
}
