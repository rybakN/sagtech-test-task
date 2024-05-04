import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { CaslModule } from 'src/casl/casl.module';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from 'src/casl/Policies.guard';

@Module({
  imports: [CaslModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
