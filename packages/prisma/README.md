# Prisma for Nest.js 📊

- [Prisma Official Github](https://github.com/prisma)
- [Github](https://github.com/nailyjs/nest-prisma)

This SDK is a nest.js version of the official Node.js SDK, which provides a simpler way to use in nest.

## Installation 📦

`npm`、`yarn`、`pnpm` are all supported. Recommend to use `pnpm`.

```bash
$ pnpm i --save @nailyjs.nest.modules/prisma prisma @prisma/client
```

## Usage 👋

### Import Module 🧩

At first, you need to import the module and configure it.

#### General Usage 🚀

```typescript
import { Module } from '@nestjs/common';
import { sms } from 'tencentcloud-sdk-nodejs';
import { TencentCloudModule } from '@nailyjs.nest.modules/tencentcloud';

@Module({
  imports: [
    TencentCloudModule.register({
      // Tencent Cloud Sdk have many clients, you can configure them here.
      clients: [
        {
          // The client class. You can find which client you need in the official documentation: https://github.com/TencentCloud/tencentcloud-sdk-nodejs?tab=readme-ov-file#%E7%AE%80%E4%BB%8B
          client: sms.v20210111.Client,
          // The client configuration object. You can find it in the official documentation: https://github.com/TencentCloud/tencentcloud-sdk-nodejs?tab=readme-ov-file#%E7%A4%BA%E4%BE%8B
          options: {
            credential: {
              secretId: '',
              secretKey: '',
            },
          },
        },
      ],
      // If you want to use the client across all your modules, you can set global to true.
      global: true,
    }),
  ],
})
export class AppModule {}
```

#### Async Usage 🚀

You can also use async configuration.

```typescript
import { Module } from '@nestjs/common';
import { sms } from 'tencentcloud-sdk-nodejs';
import { TencentCloudModule } from '@nailyjs.nest.modules/tencentcloud';

@Module({
  imports: [
    TencentCloudModule.registerAsync({
      // If you want to use the client across all your modules, you can set global to true.
      global: true,
      clients: [
        {
          // You can inject the configuration object here, such as ConfigService.
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            // Return the tencent cloud configuration object, 👆same as General Usage.
            return {
              credential: {
                secretId: 'Hello',
                secretKey: 'world',
              },
            };
          },
        },
      ],
    }),
  ],
})
export class AppModule {}
```

### How to Use Client 📝

```typescript
import { ClientRepository } from '@nailyjs.nest.modules/tencentcloud';
import { Injectable, Inject } from '@nestjs/common';
import { sms } from 'tencentcloud-sdk-nodejs';

@Injectable()
export class AppController {
  constructor(
    // You can inject the client here. For example, you want to use the sms client, you can do like this.
    @Inject(sms.v20210111.Client)
    private readonly client: ClientRepository<typeof sms.v20210111.Client>;
  ) {}

  public async sendSms() {
    // You can use the sms client like this. It type safe.
    const response = await this.client.SendSms({
      SmsSdkAppId: '',
      TemplateId: '',
      PhoneNumberSet: ['110'],
    });
  }
}
```

> ClientRepository is a generic type, you can use it to get the client type.

## Author 👨‍💻

###### **Zero**

- QQ：1203970284
- Gtihub: [Click to go](https://groupguanfang/groupguanfang)

## Donate ☕️

If you think this project is helpful to you, you can buy me a cup of coffee QWQ~

![wechat](https://github.com/nailyjs/nest-tencentcloud/blob/v1/screenshots/wechat.jpg?raw=true)
![alipay](https://github.com/nailyjs/nest-tencentcloud/blob/v1/screenshots/alipay.jpg?raw=true)
