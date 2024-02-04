import { Type } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
export interface PrismaModuleOptions {
  subscribers: Type[];
}
