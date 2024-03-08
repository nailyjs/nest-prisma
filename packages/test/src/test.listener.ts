import { AfterListen, Args, BeforeListen, Method, Model, PrismaModelMethodName, PrismaModelName, Result } from '@nailyjs.nest.modules/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestListener {
  @BeforeListen('user.findMany')
  public async findManyBefore(@Model() model: PrismaModelName, @Method() method: PrismaModelMethodName, @Args() args: any[]) {
    console.log(`有人执行了${model}上的${method}方法! 前置钩子已经执行, 参数: ${JSON.stringify(args)}`);
  }

  @AfterListen('user.findFirst')
  public async findManyAfter(@Result() returnValue: any) {
    console.log(`用户表上的findMany方法执行结束! 后置钩子已经执行, 返回值: ${returnValue}`);
  }
}
