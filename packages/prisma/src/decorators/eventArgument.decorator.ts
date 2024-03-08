import { NAILY_PRISMA_LISTENER_ARGUMENT } from '../constants';

/**
 * Get the prisma method arguments
 *
 * @author Zero <gczgroup@qq.com>
 * @date 2024/02/05
 * @export
 * @return {ParameterDecorator}
 * @example
 *
 * ```ts
 * class Test {
 *  ~@BeforeListen("user.create")
 *  public async test(@Args() args: any[]) {
 *   // Can get the prisma method arguments
 *   console.log(args);
 *  }
 * ```
 */
export function Args(): ParameterDecorator;
export function Args(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const oldMetadata = Reflect.getMetadata(NAILY_PRISMA_LISTENER_ARGUMENT, target, propertyKey) || [];
    oldMetadata[parameterIndex] = 'args';
    Reflect.defineMetadata(NAILY_PRISMA_LISTENER_ARGUMENT, oldMetadata, target, propertyKey);
  };
}

/**
 * Get the prisma model name
 *
 * @author Zero <gczgroup@qq.com>
 * @date 2024/02/05
 * @export
 * @return {ParameterDecorator}
 * @example
 *
 * ```ts
 * ~@Injectable()
 * class Test {
 *   ~@BeforeListen("user.create")
 *   public async test(@Model() model: PrismaModelName) {}
 * }
 * ```
 */
export function Model(): ParameterDecorator;
export function Model(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const oldMetadata = Reflect.getMetadata(NAILY_PRISMA_LISTENER_ARGUMENT, target, propertyKey) || [];
    oldMetadata[parameterIndex] = 'model';
    Reflect.defineMetadata(NAILY_PRISMA_LISTENER_ARGUMENT, oldMetadata, target, propertyKey);
  };
}

/**
 * Get the prisma method name
 *
 * @author Zero <gczgroup@qq.com>
 * @date 2024/02/05
 * @export
 * @return {ParameterDecorator}
 * @example
 *
 * ```ts
 * ~@Injectable()
 * class TestService {
 *   ~@BeforeListen("user.create")
 *   public async test(@Method() method: PrismaModelMethodName) {}
 * }
 * ```
 */
export function Method(): ParameterDecorator;
export function Method(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const oldMetadata = Reflect.getMetadata(NAILY_PRISMA_LISTENER_ARGUMENT, target, propertyKey) || [];
    oldMetadata[parameterIndex] = 'method';
    Reflect.defineMetadata(NAILY_PRISMA_LISTENER_ARGUMENT, oldMetadata, target, propertyKey);
  };
}

/**
 * Get the prisma method return value
 *
 * It is only can be used in the `@AfterListen` decorator
 *
 * @author Zero <gczgroup@qq.com>
 * @date 2024/03/08
 * @export
 * @return {ParameterDecorator}
 */
export function Result(): ParameterDecorator;
export function Result(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const oldMetadata = Reflect.getMetadata(NAILY_PRISMA_LISTENER_ARGUMENT, target, propertyKey) || [];
    oldMetadata[parameterIndex] = 'return';
    Reflect.defineMetadata(NAILY_PRISMA_LISTENER_ARGUMENT, oldMetadata, target, propertyKey);
  };
}
