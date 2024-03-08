import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit, Type } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaListenerMetadata, PrismaListenerParameterMetadata, PrismaModuleOptions } from './types';
import { ModuleRef } from '@nestjs/core';
import { NAILY_PRISMA_AFTER_LISTENER, NAILY_PRISMA_BEFORE_LISTENER, NAILY_PRISMA_LISTENER_ARGUMENT, NAILY_PRISMA_OPTIONS } from './constants';

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
        const beforeListenMetadata: PrismaListenerMetadata[] = Reflect.getMetadata(NAILY_PRISMA_BEFORE_LISTENER, subscriber.prototype, key);
        const afterListenMetadata: PrismaListenerMetadata[] = Reflect.getMetadata(NAILY_PRISMA_AFTER_LISTENER, subscriber.prototype, key);
        const argumentMetadata: PrismaListenerParameterMetadata[] =
          Reflect.getMetadata(NAILY_PRISMA_LISTENER_ARGUMENT, subscriber.prototype, key) || [];
        if (!beforeListenMetadata && !afterListenMetadata) continue;

        if (beforeListenMetadata) {
          for (const metadata of beforeListenMetadata) {
            this.logger.log(`Before listening ${metadata.model}.${metadata.method} by ${subscriber.name}.${key.toString()}`);
            const oldMethod = this[metadata.model][metadata.method];
            const transformArguments = (args: any[]) => {
              return argumentMetadata.map((argType) => {
                if (argType === 'args') return args;
                if (argType === 'model') return metadata.model;
                if (argType === 'method') return metadata.method;
                return null;
              });
            };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this[metadata.model][metadata.method] = async (...args: any[]) => {
              await instance[key](...transformArguments(args));
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              return await oldMethod(...args);
            };
          }
        } else if (afterListenMetadata) {
          for (const metadata of afterListenMetadata) {
            this.logger.log(`After listening ${metadata.model}.${metadata.method} by ${subscriber.name}.${key.toString()}`);
            const oldMethod = this[metadata.model][metadata.method];
            const transformArguments = (args: any[], returnValue: any) => {
              return argumentMetadata.map((argType) => {
                if (argType === 'args') return args;
                if (argType === 'model') return metadata.model;
                if (argType === 'method') return metadata.method;
                if (argType === 'return') return returnValue;
                return null;
              });
            };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this[metadata.model][metadata.method] = async (...args: any[]) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const returnValue = await oldMethod(...args);
              await instance[key](...transformArguments(args, returnValue));
              return returnValue;
            };
          }
        }
      }
    }
    await this.$connect();
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }
}
