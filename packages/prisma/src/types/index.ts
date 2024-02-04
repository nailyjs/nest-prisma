import { ArgumentsHost, HttpStatus, Type } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

export type PrismaModelName = Exclude<
  Exclude<
    Exclude<
      Exclude<
        Exclude<
          Exclude<
            Exclude<Exclude<Exclude<Exclude<Exclude<keyof PrismaClient, symbol>, '$extends'>, '$transaction'>, '$queryRawUnsafe'>, '$queryRaw'>,
            '$executeRawUnsafe'
          >,
          '$executeRaw'
        >,
        '$on'
      >,
      '$use'
    >,
    '$disconnect'
  >,
  '$connect'
>;
export type PrismaModelMethodName<ModelName extends PrismaModelName = PrismaModelName> = Exclude<
  Exclude<keyof (typeof PrismaClient.prototype)[ModelName], symbol>,
  'fields'
>;

export interface PrismaListenerMetadata<ModelName extends PrismaModelName = PrismaModelName> {
  model: ModelName;
  method: PrismaModelMethodName<ModelName>;
}

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
  useFactory: (...args: any[]) => Promise<PrismaModuleOptions> | PrismaModuleOptions;
  inject?: any[];
}
