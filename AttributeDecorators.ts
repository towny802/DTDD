import { Context } from "./Context";
import { DomainType } from "./DomainType";

export module AttributeDecorators {

export function Hidden(target: any, propertyKey: string) {
    let value = target[propertyKey];

    const getter = function () {

      if (Context.context.UserAccessLevel === "Admin" ) {
        return value;
      } else {
        return undefined;
      }
    };
  
    const setter = function (newValue: any) {
      value = newValue;
    };
  
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  
  }
}