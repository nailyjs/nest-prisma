import { NAILY_PRISMA_AFTER_LISTENER, NAILY_PRISMA_BEFORE_LISTENER } from '../constants';
import { PrismaListenerMetadata, PrismaModelName, PrismaModelMethodName, PrismaModelPath } from '../types';

/**
 * Before using this "@Beforelisten" decorator, this method will be
 * automatically executed before executing Prisma's `Model.method`.
 *
 * Example: If you use `@BeforeListen('user.findUnique')`, this method
 * will be executed before the `findUnique` method of the "user"
 * model is executed.
 *
 * @author Zero <gczgroup@qq.com>
 * @date 2024/02/05
 * @export
 * @template ModelName
 * @param {PrismaModelPath<ModelName>} model
 * @return {*}  {MethodDecorator}
 */
export function BeforeListen<ModelName extends PrismaModelName>(model: PrismaModelPath<ModelName>): MethodDecorator;
/**
 * After using this "@Beforelisten" decorator, this method will be
 * automatically executed before executing Prisma's `Model.method`.
 *
 * If you use `@BeforeListen('user', 'findUnique')`, this method
 * will be executed before the `findUnique` method of the "user"
 * model is executed.
 *
 * @author Zero <gczgroup@qq.com>
 * @date 2024/02/04
 * @export
 * @param {PrismaEvent} model
 * @param {string} method
 * @return {MethodDecorator}
 */
export function BeforeListen<ModelName extends PrismaModelName>(model: ModelName, method: PrismaModelMethodName<ModelName>): MethodDecorator;
export function BeforeListen<ModelName extends PrismaModelName>(model: ModelName, method?: PrismaModelMethodName<ModelName>): MethodDecorator {
  return (target, key) => {
    if (method) {
      const oldMetadata: PrismaListenerMetadata<ModelName>[] = Reflect.getMetadata(NAILY_PRISMA_BEFORE_LISTENER, target, key) || [];
      oldMetadata.push({ model, method });
      Reflect.defineMetadata(NAILY_PRISMA_BEFORE_LISTENER, oldMetadata, target, key);
    } else {
      const oldMetadata: PrismaListenerMetadata<ModelName>[] = Reflect.getMetadata(NAILY_PRISMA_BEFORE_LISTENER, target, key) || [];
      oldMetadata.push({
        model: model.split('.')[0] as ModelName,
        method: model.split('.')[1] as PrismaModelMethodName<ModelName>,
      });
      Reflect.defineMetadata(NAILY_PRISMA_BEFORE_LISTENER, oldMetadata, target, key);
    }
  };
}

/**
 * After using this "@Afterlisten" decorator, this method will be
 * automatically executed after executing Prisma's `Model.method`.
 *
 * Example: If you use `@AfterListen('user.findUnique')`, this method
 * will be executed after the `findUnique` method of the "user"
 * model is executed.
 *
 * @author Zero <gczgroup@qq.com>
 * @date 2024/02/05
 * @export
 * @template ModelName
 * @param {PrismaModelPath<ModelName>} model
 * @return {*}  {MethodDecorator}
 */
export function AfterListen<ModelName extends PrismaModelName>(model: PrismaModelPath<ModelName>): MethodDecorator;
/**
 * After using this "@Afterlisten" decorator, this method will be
 * automatically executed after executing Prisma's `Model.method`.
 *
 * If you use `@AfterListen('user', 'findUnique')`, this method
 * will be executed after the `findUnique` method of the "user"
 * model is executed.
 *
 * @author Zero <gczgroup@qq.com>
 * @date 2024/02/04
 * @export
 * @param {PrismaEvent} model your model name
 * @param {string} method your method name
 * @return {MethodDecorator}
 */
export function AfterListen<ModelName extends PrismaModelName>(model: ModelName, method: PrismaModelMethodName<ModelName>): MethodDecorator;
export function AfterListen<ModelName extends PrismaModelName>(model: ModelName, method?: PrismaModelMethodName<ModelName>): MethodDecorator {
  return (target, key) => {
    if (method) {
      const oldMetadata: PrismaListenerMetadata<ModelName>[] = Reflect.getMetadata(NAILY_PRISMA_AFTER_LISTENER, target, key) || [];
      oldMetadata.push({ model, method });
      Reflect.defineMetadata(NAILY_PRISMA_AFTER_LISTENER, oldMetadata, target, key);
    } else {
      const oldMetadata: PrismaListenerMetadata<ModelName>[] = Reflect.getMetadata(NAILY_PRISMA_AFTER_LISTENER, target, key) || [];
      oldMetadata.push({
        model: model.split('.')[0] as ModelName,
        method: model.split('.')[1] as PrismaModelMethodName<ModelName>,
      });
      Reflect.defineMetadata(NAILY_PRISMA_AFTER_LISTENER, oldMetadata, target, key);
    }
  };
}
