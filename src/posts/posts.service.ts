import { HttpCode, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostsService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  private async getPostById(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id: id } });

    if (!post) throw new NotFoundException(`Post with id: ${id} not found`);

    return post;
  }

  async create(createPostDto: CreatePostDto, req: Request) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const userId = this.jwtService.decode(token, {
      complete: true,
      json: true,
    }).payload.sub;

    try {
      const post = this.prisma.post.create({
        data: { ...createPostDto, userId: userId },
      });
      return post;
    } catch (e) {
      return e;
    }
  }

  async findAll() {
    return await this.prisma.post.findMany();
  }

  async findOne(id: string) {
    return await this.getPostById(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.update({
      where: { id: id },
      data: { ...updatePostDto },
    });

    if (!post) throw new NotFoundException(`Post with id: ${id} not found`);

    return post;
  }

  async remove(id: string) {
    const post = await this.prisma.post.delete({
      where: { id: id },
    });

    if (!post) throw new NotFoundException(`Post with id: ${id} not found`);

    return HttpCode(204);
  }
}
