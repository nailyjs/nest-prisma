# Nest.js 版 Prisma Node SDK ☁️

中文 | [English](./README_EN.md)

[Prisma官方Github](https://github.com/prisma)

本SDK为`Prisma`的封装。提供了一种更高级的方式在Nest中使用`Prisma`: 监听器。

## 安装 📦

`npm`、`yarn`、`pnpm` 都支持，推荐使用 `pnpm`。

```bash
$ pnpm i --save @nailyjs.nest.modules/prisma prisma
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
    private readonly prismaService: PrismaService,
    // 可以直接注入PrismaClient。PrismaClient是一个单例。
    private readonly prismaClient: PrismaClient,
  ) {}

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

  public async findMany() {
    // 这里的`findMany`方法会触发上面注册的监听器。
    this.prismaService.user.findMany();
    // 或者直接使用PrismaClient
    // 但是要注意的是，这里不会触发监听器，因为监听器是在PrismaService中注册的，
    // 要触发监听器，必须使用PrismaService中的方法。
    this.prismaClient.user.findMany();
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
