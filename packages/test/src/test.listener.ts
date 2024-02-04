import { AfterListen, BeforeListen } from '@nailyjs.nest.modules/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestListener {
  @BeforeListen('user', 'findMany')
  public async findManyBefore() {
    console.log('有人执行了用户表上的findMany方法! 前置钩子已经执行');
  }

  @AfterListen('user', 'findMany')
  public async findManyAfter() {
    console.log('用户表上的findMany方法执行结束! 后置钩子已经执行');
  }
}
