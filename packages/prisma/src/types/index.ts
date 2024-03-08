import { ArgumentsHost, HttpStatus, Type } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

export type PrismaModelName = Exclude<keyof PrismaClient, `$${string}` | symbol>;

export type PrismaModelMethodName<ModelName extends PrismaModelName = PrismaModelName> = Exclude<
  Exclude<keyof (typeof PrismaClient.prototype)[ModelName], symbol>,
  'fields'
>;
export type PrismaModelPath<ModelName extends PrismaModelName = PrismaModelName> = `${ModelName}.${PrismaModelMethodName<ModelName>}`;

export interface PrismaListenerMetadata<ModelName extends PrismaModelName = PrismaModelName> {
  model: ModelName;
  method: PrismaModelMethodName<ModelName>;
}
export type PrismaBeforeListenerParameterMetadata = 'args' | 'model' | 'method';
export type PrismaAfterListenerParameterMetadata = PrismaBeforeListenerParameterMetadata | 'return';
export type PrismaListenerParameterMetadata = PrismaBeforeListenerParameterMetadata | PrismaAfterListenerParameterMetadata;

export interface PrismaModuleFilterOptions {
  httpStatus: HttpStatus | number;
  httpHeaders: Record<string, any>;
  httpResponseData: any;
}
export interface PrismaModuleFilter {
  [prismaCode: string]: Partial<PrismaModuleFilterOptions>;
}
export type PrismaModuleFilterFunctionType = (exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) => any;
export interface PrismaModuleFilterFunction {
  [prismaCode: string]: PrismaModuleFilterFunctionType;
}
export interface PrismaModuleOptions {
  subscribers: Type[];
  filters: PrismaModuleFilter | PrismaModuleFilterFunction;
}
export interface PrismaModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<Partial<PrismaModuleOptions>> | Partial<PrismaModuleOptions>;
  inject?: any[];
}
