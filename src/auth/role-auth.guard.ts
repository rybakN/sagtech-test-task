import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';
import { PostsService } from 'src/posts/posts.service';

export const ROLE = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLE, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private postServise: PostsService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());

    if (!roles) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest();
    const url = req.url.split('/');
    const token = req.headers.authorization?.split(' ')[1];
    const userToken = this.authService.decodeJwt(token);

    return await this.matchRoles(roles, userToken, url);
  }

  private async matchRoles(roles: string[], userToken: any, url: string) {
    if (userToken.role === Role.ADMIN) return true;
    else if (roles.includes(userToken.role)) {
      if (url[1] === 'users') return userToken.sub === url[2];
      if (url[1] === 'posts')
        return (
          userToken.sub === (await this.postServise.findOne(url[2])).userId
        );
    }
  }
}
