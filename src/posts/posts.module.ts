import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { CaslModule } from 'src/casl/casl.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [CaslModule],
  controllers: [PostsController],
  providers: [PostsService, JwtService, PrismaService, UsersService],
})
export class PostsModule {}
