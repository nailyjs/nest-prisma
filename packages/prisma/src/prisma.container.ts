import { Type } from '@nestjs/common';

export interface Listener {
  keys: (string | symbol)[];
}

export class PrismaContainer {
  private static prismaContainer = new Map<Type, Listener>();
  public static prismaOptions = Symbol('options');

  public static getAll() {
    return this.prismaContainer;
  }

  public static add(listener: Type, listenerProto: Listener) {
    this.prismaContainer.set(listener, listenerProto);
  }
}
