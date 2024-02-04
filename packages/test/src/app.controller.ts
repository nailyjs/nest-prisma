import { PrismaService } from '@nailyjs.nest.modules/prisma';
import { Controller, Get } from '@nestjs/common';
import '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  public getHello() {
    return this.prismaService.user.findMany();
  }
}
