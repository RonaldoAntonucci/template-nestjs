import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    isEnum,
    registerDecorator,
} from 'class-validator';
import { createObjByStr } from '../utils/create-obj-by-str.util';

type Property = Record<string, string>;

export function QueryIncludes<T extends Property>(property: T) {
    return (object: unknown, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: {
                message: `each value in includes must be one of the following values:${Object.values(property).map((prop) => ` ${prop}`)}`,
            },
            constraints: [property],
            validator: QueryIncludesConstraint<string>,
        });
    };
}

@ValidatorConstraint({ name: 'QueryIncludes' })
export class QueryIncludesConstraint<T extends string>
    implements ValidatorConstraintInterface
{
    validate(value: T, args: ValidationArguments): boolean {
        if (!value) return true;
        if (typeof value !== 'string') return false;
        const transformedValues = value.split(',').map((value) => value.trim());

        const isValid = transformedValues.every((includeValue) =>
            isEnum(includeValue, args.constraints[0]),
        );

        if (!isValid) {
            return false;
        }

        args.object[args.property] = {};

        transformedValues.forEach((value) => {
            Object.assign(args.object[args.property], createObjByStr(value));
        });

        return true;
    }
}
