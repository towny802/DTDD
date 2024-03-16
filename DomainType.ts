export abstract class DomainType {
    id: Number

    static IDCount = 0
    
    static MetadataAttributes = ["MetadataAttributes", "id", "constructor", "getDomainEntity", "__defineGetter__",
        "__defineSetter__", "hasOwnProperty", "__lookupGetter__", "__lookupSetter__", "isPrototypeOf", "propertyIsEnumerable",
        "toString", "valueOf", "__proto__", "toLocaleString"];

    getDomainEntity(this: DomainType) {
        const attributes = [];

        // Iterate through prototype chain, stopping at null or built-in object
        for (let proto = this; proto && proto !== Object.prototype; proto = Object.getPrototypeOf(proto)) {
            const properties = Object.getOwnPropertyDescriptors(proto);

            // Filter properties based on MetadataAttributes and include inherited ones
            for (const [property, descriptor] of Object.entries(properties)) {
                if (descriptor.enumerable && !DomainType.MetadataAttributes.includes(property)) {
                    attributes.push(this[property as keyof DomainType]);
                }
            }
        }

        return attributes;
    }

    constructor() {
        this.id = DomainType.IDCount = DomainType.IDCount + 1
    }
}

