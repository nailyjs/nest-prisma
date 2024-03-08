# Nest.js 版 Prisma 📊

中文 | [English](./README_EN.md)

[Prisma官方Github](https://github.com/prisma)

本SDK为`Prisma`的封装。提供了一种更高级的方式在Nest中使用`Prisma`: 监听器。

## 安装 📦

`npm`、`yarn`、`pnpm` 都支持，推荐使用 `pnpm`。

```bash
$ pnpm i --save @nailyjs.nest.modules/prisma prisma @prisma/client
```

## 使用 👋

### 导入模块 🧩

首先，先导入模块并配置。建议在根模块中导入。

#### 正常用法 🚀

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '@nailyjs.nest.modules/prisma';

@Module({
  imports: [
    // 导入Prisma模块。如果不注册任何监听器，可以这么导入。
    PrismaModule.forRoot(),
  ],
})
export class AppModule {}
```

#### 如何使用 🍞

从`@nailyjs.nest.modules/prisma`导入`PrismaService`，里面包含了`PrismaClient`的所有方法。

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nailyjs.nest.modules/prisma';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany() {
    return this.prismaService.user.findMany();
  }
}
```

#### 监听器 🎉

`PrismaClient`我直接作为令牌注入了，所以你也可以直接使用`PrismaClient`。

但是，如果你想要监听`PrismaClient`的方法，就不能直接使用`PrismaClient`了，而是要使用`PrismaService`。

所以我建议平常就使用`PrismaService`，这样你可以在任何时候都可以添加监听器。

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nailyjs.nest.modules/prisma';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(
    // 允许直接注入PrismaService
    private readonly prismaService: PrismaService,
    // 可以直接注入PrismaClient。PrismaClient是一个单例。
    private readonly prismaClient: PrismaClient,
  ) {}

  public async findMany() {
    // 这里的`findMany`方法会触发上面注册的监听器。
    this.prismaService.user.findMany();
    // 或者直接使用PrismaClient
    // 但是要注意的是，这里不会触发监听器，因为监听器是在PrismaService中注册的，
    // 要触发监听器，必须使用PrismaService中的方法。
    this.prismaClient.user.findMany();
  }
}

@Injectable()
export class PrismaListener {
  /**
   * 假设您有一个名为`user`的prisma模型，可以在这里注册一个监听器，监听`findMany`事件。
   * BeforeListen顾名思义，就是在`findMany`方法执行之前执行的方法。
   */
  @BeforeListen('user', 'findMany')
  public async beforeFindMany() {
    console.log('before findMany');
  }

  /**
   * AfterListen顾名思义，就是在`findMany`方法执行之后执行的方法。
   */
  @AfterListen('user', 'findMany')
  public async afterFindMany() {
    console.log('after findMany');
  }

  /**
   * 监听器还支持这么写。TS会有非常完善的类型提示（小小地做了一下类型体操
   */
  @BeforeListen('user.findMany')
  public async beforeFindMany() {
    console.log('before findMany');
  }

  /**
   * 1.4.0版本之后支持多个监听器调用同一个方法。
   */
  @AfterListen('user.findMany')
  @BeforeListen('user.create')
  public async afterFindMany() {
    console.log('after findMany & before create');
  }
}
```

然后，监听器必须要在模块中注册。

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '@nailyjs.nest.modules/prisma';
import { PrismaListener } from './app.service';

@Module({
  imports: [
    PrismaModule.forRoot({
      // 注册监听器
      listeners: [PrismaListener],
    }),
  ],
})
export class AppModule {}
```

##### 参数装饰器

`1.5.0`之后被`BeforeListen`和`AfterListen`装饰的方法都支持参数装饰器。

###### @Model 💎

- Available: `@BeforeListen` `@AfterListen`
- 作用：用于获取当前模型名称。

在多个监听器装饰同一方法时，可以使用这个装饰器来获取当前模型名称。可以从库里导入工具类型`PrismaModelName`辅助推断，它是一个联合类型，包含了所有的模型名称。

```typescript
@Injectable()
export class PrismaListener {
  @BeforeListen('user.findMany')
  public async beforeFindMany(@Model() model: PrismaModelName) {
    console.log(`${model} start finding many!`);
  }
}
```

###### @Method 💎

- Available: `@BeforeListen` `@AfterListen`
- 作用：用于获取当前执行的方法名称。

在多个监听器装饰同一方法时，可以使用这个装饰器来获取当前方法名称。可以从库里导入工具类型`PrismaMethodName`辅助推断，它是一个联合类型，包含了所有的方法名称。

```typescript
@Injectable()
export class PrismaListener {
  @BeforeListen('user.findMany')
  public async beforeFindMany(@Method() method: PrismaMethodName) {
    console.log(`start execute ${method}!`);
  }
}
```

###### @Args 💎

- Available: `@BeforeListen` `@AfterListen`
- 作用：用于获取当前执行的方法的参数。

```typescript
@Injectable()
export class PrismaListener {
  @BeforeListen('user.findMany')
  public async beforeFindMany(@Args() args: any[]) {
    console.log(`start execute findMany with args: ${args}`);
  }
}
```

###### @Result 💎

- Available: `@AfterListen`
- 作用：用于获取当前执行的方法的返回值。只支持在`@AfterListen`中使用。

毕竟在`@BeforeListen`执行时，方法都还没开始执行（（😂

`result`拿到的是执行成功时候的返回值。如果方法执行失败，整个`BeforeListen`都不会执行；直接抛出错误，交给nest.js的异常处理器处理。

```typescript
@Injectable()
export class PrismaListener {
  @AfterListen('user.findMany')
  public async afterFindMany(@Result() result: any) {
    console.log(`findMany executed with result: ${result}`);
  }
}
```

## 作者 👨‍💻

###### **Zero**

- QQ：1203970284
- Gtihub: [跳转](https://groupguanfang/groupguanfang)

## ☕️ 捐赠 ☕️

如果你觉得这个项目对你有帮助，你可以请我喝杯咖啡QWQ~

![wechat](./screenshots/wechat.jpg)
![alipay](./screenshots/alipay.jpg)

```

```
