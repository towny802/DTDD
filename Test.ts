import { DomainType } from "./DomainType"
import "reflect-metadata";

import { Context } from "./Context";




function iterateAttributesAndGetMethods() {
    let proto = Dog.prototype;
    const dogProperties = Object.getOwnPropertyNames(Dog.prototype);
    const result = [];
    while (proto) {
        const properties = Object.getOwnPropertyDescriptors(proto);
        for (const [property, descriptor] of Object.entries(properties)) {
            if (descriptor && (descriptor.value !== undefined || typeof descriptor.get === 'function')) {
                if (dogProperties.includes(property)) {
                    result.push({
                        Property: property,
                        Descr: descriptor
                    });
                }
            }
        }
        proto = Object.getPrototypeOf(proto);
    }
    return result;
}

function Hidden(target: any, propertyKey: string) {
    let value = target[propertyKey];
  
    const getter = function () {
      if (Context.context.UserAccessLevel === "Admin") {
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
  


Context.context.UserAccessLevel = "User"

class Dog extends DomainType{
    Name: String = ""

    @Hidden
    Age: Number = 3

    get Bark(): string {
        return "bork"
    }

    @Hidden
    get Length(): Number {
        return 5
    }
}


var pup1 = new Dog


/*console.log(pup1.Age)
pup1.Age = 6
Context.context.UserAccessLevel = "Admin"
console.log(pup1.Age)
Context.context.UserAccessLevel = "User"
console.log(pup1.Age)
Context.context.UserAccessLevel = "Admin"
pup1.Age = 2
console.log(pup1.Age)*/