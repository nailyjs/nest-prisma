import { DynamicModule, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaModuleOptions } from './types';
import { PrismaContainer } from './prisma.container';
import { PrismaClient } from '@prisma/client';

@Module({})
export class PrismaModule {
  public static forRoot(options: Partial<PrismaModuleOptions> = {}): DynamicModule {
    options.subscribers = options.subscribers || [];
    return {
      module: PrismaModule,
      providers: [
        ...options.subscribers,
        {
          provide: PrismaContainer.prismaOptions,
          useValue: options,
        },
        {
          provide: PrismaClient,
          useClass: PrismaClient,
        },
        {
          provide: PrismaService,
          useClass: PrismaService,
        },
      ],
      exports: [...options.subscribers, PrismaService],
      global: true,
    };
  }
}
