import { Type } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export type PrismaEvent = Exclude<keyof PrismaClient, '$'>;

export interface PrismaListenerMetadata {
  model: PrismaEvent;
  method: string;
}

export interface PrismaModuleOptions {
  subscribers: Type[];
}
