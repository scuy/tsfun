import {isArray, isNot, isObject} from './predicate';
import {Comparator, ComparatorProducer} from './type';
import {subtractBy} from './arrayset';
import {getElForPathIn} from './objectstruct';

// ------------ @author Daniel de Oliveira -----------------


export const tripleEqual: any = <A>(l:A) =>
    (r:A) => l === r;


export const is = tripleEqual;


export const isnt = <A>(l: A) => isNot(tripleEqual(l));


export const jsonEqual: any = <A>(l:A) =>
    (r:A) => tripleEqual(JSON.stringify(l))(JSON.stringify(r));


export const biggerThan: any = <A>(l:A) =>
    (r: A) => l < r;


export const smallerThan: any = <A>(l:A) =>
    (r: A) => l > r;


export const differentFromBy: ComparatorProducer = (compare: Comparator) => <A>(a:A) =>
    isNot(compare(a));


export const differentFrom = differentFromBy(tripleEqual);


export const includedInBy = (compare: Comparator) => <A>(as: Array<A>) =>
    (a: A): boolean => {

        if (!isArray(as)) throw new TypeError('includedInBy: expected an Array');

        return includesBy(compare)(as, a).length > 0;
    };


export const includedIn =  includedInBy(tripleEqual);


export const containedInBy = (compare: Comparator) => <A>(superset: Array<A>) =>
    (subset: Array<A>): boolean => {

        if (!isArray(subset) || !isArray(superset))
            throw new TypeError('containedInBy: expected Arrays');

        if (subset.length > superset.length) return false;

        return subset
            .filter(includedInBy(compare)(superset))
            .length === subset.length;
    };


export const containedIn = containedInBy(tripleEqual);


const compare = (acomparator: Comparator, ocomparator: Comparator) => (l: any) =>
    (r: any): boolean => {

    // Array
    if (isArray(l) && isArray(r)) return acomparator(l)(r);

    // {} or Object
    if (isObject(l) && isObject(r)) {
        if (!arrayEquivalent(Object.keys(l))(Object.keys(r))) return false;
        return ocomparator(l)(r);
    }

    return l instanceof Object && r instanceof Object

        // for example Date, Map
        ? jsonEqual(l)(r)

        // numbers, strings
        : typeof l === typeof r && l === r;
};


const c = (acomparator: Comparator, ocomparator: Comparator) => (l: any) =>
    (r: any): boolean => compare(acomparator, ocomparator)(l)(r);


export const arrayEqualBy = (objectComparator?: Comparator) =>
    <A>(as1: Array<A>) => (as2: Array<A>): boolean => {

        const ocmp = objectComparator ? objectComparator : objectEqual;

        return as1.length !== as2.length
            ? false
            : as1
                .filter((a, i) => compare(arrayEqual as any, ocmp)(a)(as2[i]))
                .length === as2.length;
    };


export const arrayEqual = arrayEqualBy();


// Compares 2 arrays where elements order does not matter
export const arrayEquivalentBy: (_: Comparator) => any =
    (objectComparator?: Comparator) =>
        <A>(as1: Array<A>) =>
            (as2: Array<A>) => {

                const ocmp = objectComparator ? objectComparator : objectEqualBy(arrayEquivalent);
                const acmp = objectComparator ? arrayEquivalentBy(ocmp): arrayEquivalent;

                return subtractBy(c(acmp, ocmp))(as1)(as2).length === 0
                    && subtractBy(c(acmp, ocmp))(as2)(as1).length === 0;
            };


// Compares 2 arrays where elements order does not matter
export const arrayEquivalent: Comparator = arrayEquivalentBy(undefined as any);


export const objectEqualBy =
    (arrayComparator: Comparator) =>
        (o1: Object) =>
            (o2: Object): boolean => {

                if (!isObject(o1) || !isObject(o2))
                    throw new TypeError('types do not match objectEqualBy');

                if (!arrayEquivalent(Object.keys(o1))(Object.keys(o2))) return false;

                return Object
                    .keys(o1)
                    .filter(key => {

                        return compare(
                            arrayComparator,
                            objectEqualBy(arrayComparator))
                            ((o1 as any)[key])
                            ((o2 as any)[key]);
                    })
                    .length === Object.keys(o1).length;
            };


export const objectEqual: Comparator = objectEqualBy(arrayEqual as any);


export const equalBy =
    (arrayComparator: Comparator) =>
        (o1: any) =>
            (o2: any): boolean => compare(arrayComparator,
                objectEqualBy(arrayComparator))(o1)(o2);


export const equal = equalBy(arrayEqual as any);


export const equalTo = equal;


export const equivalent = equalBy(arrayEquivalent);


const onBy = (compare: Function) => (path: string) =>
    (l: any) => (r: any) =>
        path.length === 0
            ? undefined
            : compare(
                path.charAt(path.length - 1) === ':'
                ? l : getElForPathIn(l, path))
            (getElForPathIn(r, path.charAt(path.length - 1) === ':' ? path.slice(0, -1) : path));


export const on = (path: string, compare: Function = tripleEqual) =>
    (l: any) =>
         typeof compare(l) === 'function'
            ? (r: any) => onBy(compare)(path)(l)(r)
            : compare(getElForPathIn(l, path));


const includesBy =
    (compare: Comparator = tripleEqual) =>
        <A>(as: Array<A>, a: A) =>
            as.filter(compare(a));



export const sameOn = <T>(path: string, l: T, r: T) =>
     on(path)(l)(r);


export const without = (path: string|string[], compare: Function = tripleEqual) =>
    (l: any): any => {

        const keys = Object
            .keys(l)
            .filter(isNot(
                isArray(path)
                    ? includedIn(path as string[])
                    : equalTo(path)));

        return typeof compare(l) === 'function'
            ? (r: any) => keys.reduce((acc, key) => acc && compare(r[key])(l[key]), true)
            : keys.reduce((acc, key) => acc && compare(l[key]), true)
    };