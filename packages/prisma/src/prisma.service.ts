import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit, Type } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaListenerMetadata, PrismaModuleOptions } from './types';
import { ModuleRef } from '@nestjs/core';
import { NAILY_PRISMA_AFTER_LISTENER, NAILY_PRISMA_BEFORE_LISTENER, NAILY_PRISMA_OPTIONS } from './constants';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly subscribers: Type[] = [];
  private readonly logger = new Logger(PrismaService.name);

  constructor(
    @Inject(NAILY_PRISMA_OPTIONS)
    options: PrismaModuleOptions,
    @Inject(ModuleRef)
    private readonly moduleRef: ModuleRef,
  ) {
    super();
    if (options && options.subscribers) this.subscribers = options.subscribers;
  }

  public async onModuleInit() {
    for (const subscriber of this.subscribers) {
      const instance = await this.moduleRef.create(subscriber);
      const keys = Reflect.ownKeys(subscriber.prototype).filter((key) => key !== 'constructor');
      for (const key of keys) {
        const beforeListenMetadata: PrismaListenerMetadata = Reflect.getMetadata(NAILY_PRISMA_BEFORE_LISTENER, subscriber.prototype, key);
        const afterListenMetadata: PrismaListenerMetadata = Reflect.getMetadata(NAILY_PRISMA_AFTER_LISTENER, subscriber.prototype, key);
        if (!beforeListenMetadata && !afterListenMetadata) continue;

        if (beforeListenMetadata) {
          this.logger.log(`PrismaListener: before listening ${subscriber.name}.${key.toString()} by ${instance.constructor.name}`);
          const oldMethod = this[beforeListenMetadata.model][beforeListenMetadata.method];
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this[beforeListenMetadata.model][beforeListenMetadata.method] = async (...args: any[]) => {
            await instance[key](...args);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const returnValue = await oldMethod(...args);
            return returnValue;
          };
        } else if (afterListenMetadata) {
          this.logger.log(`PrismaListener: after listening ${subscriber.name}.${key.toString()} by ${instance.constructor.name}`);
          const oldMethod = this[afterListenMetadata.model][afterListenMetadata.method];
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this[afterListenMetadata.model][afterListenMetadata.method] = async (...args: any[]) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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
