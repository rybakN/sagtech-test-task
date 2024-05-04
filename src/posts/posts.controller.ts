import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public } from 'src/auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/role-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body(new ValidationPipe({ whitelist: true })) createPostDto: CreatePostDto,
    @Request() req,
  ) {
    return this.postsService.create(createPostDto, req);
  }

  @Public()
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Public()
  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.postsService.findOne(uuid);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Patch(':uuid')
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body(new ValidationPipe({ whitelist: true })) updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(uuid, updatePostDto);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.postsService.remove(uuid);
  }
}
