import { DynamicModule, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaModuleAsyncOptions, PrismaModuleOptions } from './types';
import { PrismaClient } from '@prisma/client';
import { NAILY_PRISMA_OPTIONS } from './constants';

@Module({})
export class PrismaModule {
  public static forRoot(options: Partial<PrismaModuleOptions> = {}): DynamicModule {
    options.subscribers = options.subscribers || [];
    return {
      module: PrismaModule,
      providers: [
        ...options.subscribers,
        {
          provide: NAILY_PRISMA_OPTIONS,
          useValue: options,
        },
        {
          provide: PrismaClient,
          useClass: PrismaClient,
        },
        PrismaService,
      ],
      exports: [...options.subscribers, PrismaService],
      global: true,
    };
  }

  public static forRootAsync(options: PrismaModuleAsyncOptions): DynamicModule {
    return {
      module: PrismaModule,
      providers: [
        {
          provide: NAILY_PRISMA_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: PrismaClient,
          useClass: PrismaClient,
        },
        PrismaService,
      ],
      exports: [PrismaService],
      global: true,
    };
  }
}
