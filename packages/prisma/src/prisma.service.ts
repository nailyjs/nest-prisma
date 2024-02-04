import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit, Type } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaListenerMetadata, PrismaModuleOptions } from './types';
import { ModuleRef } from '@nestjs/core';
import { NAILY_PRISMA_AFTER_LISTENER, NAILY_PRISMA_BEFORE_LISTENER } from './constants';
import { PrismaContainer } from './prisma.container';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly subscribers: Type[] = [];

  constructor(
    @Inject(PrismaContainer.prismaOptions)
    options: PrismaModuleOptions,
    @Inject(ModuleRef)
    private readonly moduleRef: ModuleRef,
  ) {
    super();
    if (options && options.subscribers) this.subscribers = options.subscribers;
  }

  public async onModuleInit() {
    for (const subscriber of this.subscribers) {
      const instance = this.moduleRef.get(subscriber, { strict: false });
      const keys = Reflect.ownKeys(subscriber.prototype).filter((key) => key !== 'constructor');
      for (const key of keys) {
        const beforeListenMetadata: PrismaListenerMetadata = Reflect.getMetadata(NAILY_PRISMA_BEFORE_LISTENER, instance, key);
        const afterListenMetadata: PrismaListenerMetadata = Reflect.getMetadata(NAILY_PRISMA_AFTER_LISTENER, instance, key);
        new Logger().log(`PrismaListener: ${subscriber.name}.${key.toString()}`);
        if (!beforeListenMetadata && !afterListenMetadata) continue;

        if (beforeListenMetadata) {
          const oldMethod = this[beforeListenMetadata.model][beforeListenMetadata.method];
          this[beforeListenMetadata.model][beforeListenMetadata.method] = async (...args: any[]) => {
            await instance[key](...args);
            const returnValue = await oldMethod(...args);
            return returnValue;
          };
        } else if (afterListenMetadata) {
          const oldMethod = this[afterListenMetadata.model][afterListenMetadata.method];
          this[afterListenMetadata.model][afterListenMetadata.method] = async (...args: any[]) => {
            const returnValue = await oldMethod(...args);
            await instance[key](...args);
            return returnValue;
          };
        }
      }
    }
    await this.$connect();
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }
}
