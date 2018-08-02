import {subtract} from './arrays/sets';
import {subtract as subtractO} from './objects/sets';
import {Transformation} from "./core";
import {obj} from "./objects/objects";


/**
 * @author Daniel de Oliveira
 */


type ArrayTransformation<T> = Transformation<Array<T>>;

export function copy<T>(as: Array<T>): Array<T>;
export function copy(as: obj): obj;
export function copy<T>(coll: Array<T>|obj): Array<T>|obj {

    return coll instanceof Array
        ? subtract([])(coll as any) as Array<T>
        : subtractO([])(coll);
}


export function isEmpty(object: any): boolean { // TODO unit test, maybe type param better

    return object instanceof Array
        ? object.length === 0
        : Object.keys(object).length === 0;
}