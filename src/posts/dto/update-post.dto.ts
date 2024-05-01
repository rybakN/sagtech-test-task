import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsUUID } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsUUID()
  id: string;
}
