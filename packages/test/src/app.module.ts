import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@nailyjs.nest.modules/prisma';
import { TestListener } from './test.listener';

@Module({
  imports: [
    PrismaModule.forRoot({
      subscribers: [TestListener],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
