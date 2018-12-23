import {intersect as intersectA} from "./arrays_set_like";
import {subtract as subtractA} from "./arrays_set_like";
import {identical} from "../core";
import {UntypedObjectCollection} from '../types';
import {mapProperties} from './objects_coll';


export const subtractObject = (subtrahend: Array<string | number> | any) =>
    (o: UntypedObjectCollection): UntypedObjectCollection => {

        if (Array.isArray(o)) throw new TypeError('invalid argument');

        const keys =
            (
                Array.isArray(subtrahend)
                    ? subtractA(subtrahend.map(_ => _.toString()))
                    : subtractA(Object.keys(subtrahend))

            )(Object.keys(o));

        return mapProperties(identical)(
            keys,
            o);
    };


export function unionObject([first, ...rest]: UntypedObjectCollection[]): UntypedObjectCollection {

    return first && rest.length > 0
        ? uniteObject(...rest)(first)
        : first
            ? first
            : {};
}


export const uniteObject = (...addends: UntypedObjectCollection[]) =>
    (o: UntypedObjectCollection): UntypedObjectCollection => {

        if (Array.isArray(o)) throw new TypeError('invalid argument');
        for (let addend of addends)
            if (Array.isArray(addend)) throw new TypeError('invalid argument');

        return Object.assign({}, o, ...addends);
    };


export const intersectObject = (o1: any) =>
    (o2: UntypedObjectCollection): UntypedObjectCollection => {

        if (Array.isArray(o2)) throw new TypeError('invalid argument');

        const keys = intersectA(
            Array.isArray(o1)
                ? o1.map(x => x.toString())
                : Object.keys(o1)
        )(Object.keys(o2));

        return mapProperties(identical)(
            keys,
            (!Array.isArray(o1) ? o1 : o2)
        );
    };


