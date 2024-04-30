import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PrismaService} from "../prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
  }
  private async findUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      }
    });

    if (!user) throw new NotFoundException("User not found.")

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    try { return await this.prisma.user.create({data: createUserDto});}
    catch (e) {
      return e
    }
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.findUser(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.prisma.user.update({
      where: {id: id},
      data: {...CreateUserDto},
    })

    if (!user) throw new NotFoundException("User not found.")

    return user;
  }

  remove(id: string) {
    const user = this.prisma.user.delete({
      where: {id: id},
    })

    if (!user) throw new NotFoundException("User not found.")
  }
}
