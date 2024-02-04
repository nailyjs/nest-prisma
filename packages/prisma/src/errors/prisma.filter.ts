import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NAILY_PRISMA_OPTIONS } from '../constants';
import { PrismaModuleFilterFunctionType, PrismaModuleFilterOptions, PrismaModuleOptions } from '../types';
import { Response } from 'express';

@Catch(Prisma?.PrismaClientKnownRequestError)
export class PrismaExpressFilter implements ExceptionFilter {
  @Inject(NAILY_PRISMA_OPTIONS)
  private readonly options: PrismaModuleOptions;

  public catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const filters = this.options.filters || {};

    for (const prismaCode in filters) {
      if (typeof filters[prismaCode] === 'object' && exception.code === prismaCode) {
        const filter = filters[prismaCode] as Partial<PrismaModuleFilterOptions>;
        return response
          .status(filter.httpStatus || 500)
          .set(
            (() => {
              const headers = {};
              for (const key in filter.httpHeaders) {
                headers[key] = filter.httpHeaders[key];
              }
              return headers;
            })(),
          )
          .send(filter.httpResponseData);
      } else if (typeof filters[prismaCode] === 'function' && exception.code === prismaCode) {
        return (filters[prismaCode] as PrismaModuleFilterFunctionType)(exception, host);
      } else if (typeof filters[prismaCode] === 'object' && prismaCode === 'ALL') {
        const filter = filters[prismaCode] as Partial<PrismaModuleFilterOptions>;
        return response
          .status(filter.httpStatus)
          .set(
            (() => {
              const headers = {};
              for (const key in filter.httpHeaders) {
                headers[key] = filter.httpHeaders[key];
              }
              return headers;
            })(),
          )
          .send(filter.httpResponseData);
      } else if (typeof filters[prismaCode] === 'function' && prismaCode === 'ALL') {
        return (filters[prismaCode] as PrismaModuleFilterFunctionType)(exception, host);
      }
    }
  }
}
