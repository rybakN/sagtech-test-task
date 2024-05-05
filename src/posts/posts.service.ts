import { HttpCode, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private async getPostById(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id: id } });

    if (!post) throw new NotFoundException(`Post with id: ${id} not found`);

    return post;
  }

  async create(createPostDto: CreatePostDto, userId: string) {
    const post = await this.prisma.post.create({
      data: { ...createPostDto, userId: userId },
    });
    return post;
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

    return null;
  }
}
