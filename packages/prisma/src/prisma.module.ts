import { DynamicModule, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaModuleAsyncOptions, PrismaModuleOptions } from './types';
import { PrismaClient } from '@prisma/client';
import { NAILY_PRISMA_OPTIONS } from './constants';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExpressFilter } from './errors';

@Module({})
class PrismaFactoryModule {}

@Module({})
export class PrismaModule {
  public static forRoot(options: Partial<PrismaModuleOptions> = {}): DynamicModule {
    options = options || {};
    options.subscribers = options.subscribers || [];
    options.filters = options.filters || {};
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
        {
          provide: APP_FILTER,
          useClass: PrismaExpressFilter,
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
      imports: [PrismaFactoryModule],
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
        {
          provide: APP_FILTER,
          useClass: PrismaExpressFilter,
        },
        PrismaService,
      ],
      exports: [PrismaService],
      global: true,
    };
  }
}
