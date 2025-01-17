import {Comparator, ComparatorProducer, Pair, Predicate, Path, Mapping} from './type'
import {and, empty, isArray, isArray2, isFunction, isNot, isNumber, isObject, isString, or} from './predicate'
import {subtractBy} from './set'
import {to} from './struct'
import {conds, flow, otherwise, throws} from './composition'
import {size, map, $remove} from './associative'
import {reverse} from './array'
import {zip} from './array'
import { identity, throwIllegalArgs } from './core'



// ------------ @author Daniel de Oliveira -----------------


/**
 * tsfun | tripleEqual
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/reference/triple_equal.spec.ts
 */
export function tripleEqual<A>(l:A) {

    return (r: A) => l === r
}


/**
 * tsfun | is
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/reference/gt.spec.ts
 */
 export function is<A>(a: A) {

    return tripleEqual(a)
}


/**
 * tsfun | isnt
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/reference/isnt.spec.ts
 */
export const isnt = <A>(l: A) => isNot(tripleEqual(l))


/**
 * tsfun | gt
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/number/gt.spec.ts
 */
export function gt(than: number) {
    if (!isNumber(than)) throw 'illegal argument - number expected'
    return (that: number) => {
        if (!isNumber(that)) throw 'illegal argument - number expected'
        return that > than
    }
}


/**
 * tsfun | lt
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/number/lt.spec.ts
 */
export function lt(than: number) {
    if (!isNumber(than)) throw 'illegal argument - number expected'
    return (that: number) => {
        if (!isNumber(that)) throw 'illegal argument - number expected'
        return that < than
    }
}


/**
 * tsfun | gte
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/number/gte.spec.ts
 */
export function gte(than: number) {
    if (!isNumber(than)) throw 'illegal argument - number expected'
    return (that: number) => {
        if (!isNumber(that)) throw 'illegal argument - number expected'
        return that >= than
    }
}


/**
 * tsfun | lte
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/number/lte.spec.ts
 */
export function lte(than: number): (that: number) => boolean
export function lte(than: number) {
    if (!isNumber(than)) throw 'illegal argument - number expected'
    return (that: number) => {
        if (!isNumber(that)) throw 'illegal argument - number expected'
        return that <= than
    }
}


const differentFromBy: ComparatorProducer = (compare: Comparator) => <A>(a:A) =>
    isNot(compare(a))


export const includedInBy = (compare: Comparator) => <A>(as: Array<A>) =>
    (a: A): boolean => {

        if (!isArray(as)) throw 'illegal argument - includedInBy: expected an Array'

        return includesBy(compare)(a)(as)
    }


export const includesBy =
    (compare: Comparator = tripleEqual as any) =>
        <A>(a: A) => (as: Array<A>) =>
            as.filter(compare(a)).length > 0


/**
 * tsfun | subsetOfBy
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/array/subset_of.spec.ts
 */
export const subsetOfBy = (compare: Comparator) => <A>(superset: Array<A>) =>
    (subset: Array<A>): boolean => {

        if (!isArray(subset) || !isArray(superset))
            throw 'illegal argument - containedInBy: expected Arrays'

        return subset
            .filter(includedInBy(compare)(superset))
            .length === subset.length
    }


/**
 * tsfun | supersetOfBy
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/array/superset_of.spec.ts
 */
export const supersetOfBy = (compare: Comparator) => <A>(subset: Array<A>) =>
    (superset: Array<A>): boolean => subsetOfBy(compare)(superset)(subset)


const compare = (acomparator: Comparator, ocomparator: Comparator) => (l: any) =>
    (r: any): boolean => {

        // Array
        if (isArray(l) && isArray(r)) return acomparator(l)(r)

        // {} or Object
        if (isObject(l) && isObject(r)) {
            if (!samesetBy(undefined as any)(Object.keys(l))(Object.keys(r))) return false
            return ocomparator(l)(r)
        }

        if (l instanceof Object && r instanceof Object) {
            // for example Date, Map
            throwIllegalArgs('compare', 'not a class instance', JSON.stringify(l) + ':' + JSON.stringify(r))
        }

        return typeof l === typeof r && l === r
    }


const c = (acomparator: Comparator, ocomparator: Comparator) => (l: any) =>
    (r: any): boolean => compare(acomparator, ocomparator)(l)(r)


/**
 * tsfun | arrayEqualBy
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/struct/array_equal.spec.ts
 */
export const arrayEqualBy = (objectComparator?: Comparator) =>
    <A>(as1: Array<A>) => (as2: Array<A>): boolean => {

        const ocmp = objectComparator ? objectComparator : objectEqualBy(arrayEqualBy() as any)

        return as1.length !== as2.length
            ? false
            : as1
            .filter((a, i) => compare(equalBy(arrayEqualBy() as any) as any, ocmp)(a)(as2[i]))
            .length === as2.length
    }


/**
 * tsfun | samesetBy
 *
 * Compares 2 arrays where elements order does not matter
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/set/sameset.spec.ts
 */
export const samesetBy: (_: Comparator) => any =
    (objectComparator?: Comparator) =>
        <A>(as1: Array<A>) =>
            (as2: Array<A>) => {

                const ocmp = objectComparator ? objectComparator : objectEqualBy(samesetBy(undefined as any))
                const acmp = objectComparator ? samesetBy(ocmp): samesetBy(undefined as any)

                return subtractBy(c(acmp, ocmp))(as1)(as2).length === 0
                    && subtractBy(c(acmp, ocmp))(as2)(as1).length === 0
            }


/**
 * tsfun | objectEqualBy
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/struct/object_equal.spec.ts
 */
export const objectEqualBy =
    (arrayComparator: Comparator) =>
        (o1: Object) =>
            (o2: Object): boolean => {

                if (!isObject(o1) || !isObject(o2))
                    throw new TypeError('types do not match objectEqualBy')

                if (!samesetBy(undefined as any)(Object.keys(o1))(Object.keys(o2))) return false

                return Object
                    .keys(o1)
                    .filter(key => {

                        return compare(
                            arrayComparator,
                            objectEqualBy(arrayComparator))
                        ((o1 as any)[key])
                        ((o2 as any)[key])
                    })
                    .length === Object.keys(o1).length
            }

/**
 * tsfun | equalBy
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/struct/equal.spec.ts
 */
export const equalBy =
    (arrayComparator: Comparator) =>
        o1 => (o2): boolean =>
            compare(arrayComparator,
                objectEqualBy(arrayComparator))(o1)(o2)


/**
 * tsfun | on
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/on.spec.ts
 */
export function on<T1, T2>(mapping: Mapping<T1,T2>): Comparator<T1>
export function on<T1, T2>(mapping: Mapping<T1,T2>, comparator: Comparator<T2,T2>): Comparator
export function on<T1, T2>(mapping: Mapping<T1,T2>, predicate: Predicate<T2>): Predicate
export function on<T1,T2>(mapping: Mapping<T1,T2>, value: T2): Predicate<T1>
export function on<T>(path: Path): Comparator<T>
export function on<T1,T2>(path: Path, precicate: Predicate<T1>): Predicate<T2>
export function on<T1,T2>(path: Path, comparator: Comparator<T1,T2>): Comparator<T1,T2>
export function on<T1,T2>(path: Path, value: T1): Predicate<T2>
export function on(path, compare?) {

    return flow(
        path,
        conds(
            or(and(isString, isNot(empty)), isNumber, isArray2),
            to,
            isFunction,
            identity,
            otherwise,
            throws('illegal argument - path must be one of string, number, array of length 2 or function')),
        mapping =>
            l =>
                compare === undefined
                    ? r => mapping(l) === mapping(r)
                    : isFunction(compare)
                        ? isFunction(compare(mapping(l)))
                            ? r => compare(mapping(l))(mapping(r))
                            : compare(mapping(l))
                        : is(compare)(mapping(l)))
}


/**
 * tsfun | onBy
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/struct/on.spec.ts
 */
export function onBy<T1,T2>(compare: (l: T1) => (r: T2) => boolean): (path: Path|Mapping, cmp?: T1) => (l: T1) => (r: T2) => boolean;
export function onBy(compare) {

    return (path, cmp) => {

        if (cmp !== undefined && !isFunction(cmp)) return on(path, compare(cmp))
        else return (on as any)(path, compare)
    }
}


export const by = <A>(p: Predicate<A>) => p


/**
 * tsfun | differentFrom
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/reference/different_from.spec.ts
 */
export function differentFrom(comp: Comparator, that: any): (_: any) => boolean
export function differentFrom(that: any): (_: any) => boolean
export function differentFrom(...args) {

    if (args.length > 0 && isFunction(args[0])) {
        return differentFromBy(args[0])(args[1])
    }

    const that = args[0]
    return differentFromBy(tripleEqual as any)(that)
}


/**
 * tsfun | includedIn
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/set/includedIn.spec.ts
 */
export function includedIn<A>(as: Array<A>): (a: A) => boolean
export function includedIn<A>(comp: Comparator, as: Array<A>): (a: A) => boolean
export function includedIn<A>(...args) {

    if (args.length > 1 && isFunction(args[0])) {
        return includedInBy(args[0])(args[1])
    }

    const as = args[0]

    return (a: A) => {

        if (isArray(as)) {

            return includedInBy(tripleEqual as any)(as as any)(a)

        } else {

            throw 'illegal argument in includedIn'
        }
    }
}


/**
 * tsfun | includes
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/set/includes.spec.ts
 */
export function includes<A>(a: A): (as: Array<A>) => boolean
export function includes<A>(comp: Comparator, a: A): (as: Array<A>) => boolean
export function includes<A>(...args) {

    if (args.length > 1 && isFunction(args[0])) {
        return includesBy(args[0])(args[1])
    }

    const a = args[0]

    return (as: Array<A>) => {

        if (isArray(as)) {

            return includesBy(tripleEqual as any)(a)(as as any)

        } else {

            throw 'illegal argument in includes'
        }
    }
}


/**
 * tsfun | arrayEqual
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/struct/array_equal.spec.ts
 */
export function arrayEqual<A>(comp: Comparator, that: Array<A>): (_: Array<A>) => boolean
export function arrayEqual<A>(that: Array<A>): (_: Array<A>) => boolean
export function arrayEqual<A>(...args) {

    if (args.length > 1 && isFunction(args[0])) {
        return arrayEqualBy(args[0])(args[1])
    }

    const that = args[0]
    return arrayEqualBy(undefined as any)(that)
}


/**
 * tsfun | sameset
 * Compares 2 arrays where elements order does not matter
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/set/sameset.spec.ts
 */
export function sameset<A>(that: Array<A>): (as2: Array<A>) => boolean
export function sameset<A>(comp: Comparator, that: Array<A>): (as2: Array<A>) => boolean
export function sameset<A>(that: Array<A>, as2: Array<A>): boolean
export function sameset<A>(comp: Comparator, that: Array<A>, as2: Array<A>): boolean
export function sameset<A>(...args): any {

    if (args.length > 1 && isFunction(args[0])) {

        return args.length === 2
            ? samesetBy(args[0])(args[1])
            : samesetBy(args[0])(args[1])(args[2])
    }

    const that = args[0]
    const as2  = args.length > 1 ? args[1] : undefined

    const inner = (as2: Array<A>|string) => {

        if (isArray(that) && isArray(as2)) {

            return samesetBy(undefined as any)(that)(as2)

        } else {

            throw 'illegal argument - arguments must be either both arrays or both strings'
        }
    }

    return as2 === undefined
        ? inner
        : inner(as2)
}


/**
 * tsfun | subsetOf
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/set/subset_of.spec.ts
 */
export function subsetOf<A>(comp: Comparator, that: Array<A>): {
    (as2: Array<A>): boolean
}
export function subsetOf<A>(that: Array<A>): {
    (as2: Array<A>): boolean
}
export function subsetOf<A>(that: Array<A>, as2: Array<A>): boolean
export function subsetOf<A>(comp: Comparator, that: Array<A>, as2: Array<A>): boolean
export function subsetOf<A>(...args): any {

    if (args.length > 1 && isFunction(args[0])) {
        return args.length === 2
            ? subsetOfBy(args[0])(args[1])
            : subsetOfBy(args[0])(args[1])(args[2])
    }

    const that = args[0]
    const as2 = args[1]

    const inner = (as2: any): any => {

        if (isArray(that) && isArray(as2)) {

            return subsetOfBy(undefined as any)(that as any)(as2 as any)

        } else {

            throw 'illegal argument - arguments must be either both arrays or both strings'
        }
    }

    return as2 === undefined
        ? inner
        : inner(as2)
}


/**
 * tsfun | supersetOf
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/set/superset_of.spec.ts
 */
export function supersetOf<A>(that: Array<A>): {
    (as2: Array<A>): boolean
}
export function supersetOf<A>(that: Array<A>, as2: Array<A>): boolean
export function supersetOf<A>(that: any, as2?: any): any {

    const inner = (as2: any): any => {

        if (isArray(that) && isArray(as2)) {

            return supersetOfBy(undefined as any)(that as any)(as2 as any)

        } else {

            throw 'illegal argument - arguments must be either both arrays or both strings'
        }
    }

    return as2 === undefined
        ? inner
        : inner(as2)
}


/**
 * tsfun | objectEqual
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/struct/object_equal.spec.ts
 */
export function objectEqual(comp: Comparator, o1: Object): (o2: Object) => boolean
export function objectEqual(o1: Object): (o2: Object) => boolean
export function objectEqual(...args) {

    if (args.length > 0 && isFunction(args[0])) {
        return objectEqualBy(args[0])(args[1])
    }

    const o1 = args[0]
    return objectEqualBy(arrayEqual as any)(o1)
}


/**
 * tsfun | equal
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/struct/equal.spec.ts
 */
export function equal(o1: undefined, o2: undefined): true
export function equal(comp: Comparator, o1: undefined, o2: undefined): true
export function equal<T>(comp: Comparator, o1: T, o2: T): boolean
export function equal(comp: Comparator, o1: undefined): {
    (o2: undefined): true
    (o2: any): false
}
export function equal<T>(comp: Comparator, o1: T): (o2: T) => boolean
export function equal<T>(o1: T, o2: T): boolean
export function equal(o1: undefined): {
    (o2: undefined): true
    (o2: any): false
}
export function equal<T>(o1: T): (o2: T) => boolean
export function equal(o1: any, ...os: any[]): any {

    if (isFunction(o1)) {
        return (os.length === 1)
            ? equalBy(o1)(os[0])
            : equalBy(o1)(os[0])(os[1])
    }


    if (os.length > 1) throw 'illegal argument - equal expects 1 or 2 arguments in first parameter list'
    return os.length === 0
        ? (o2: any) => equalBy(arrayEqual as any)(o2)(o1)
        : equalBy(arrayEqual as any)(os[0])(o1)
}


/**
 * tsfun | startsWith
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/list/starts_with.spec.ts
 */
export function startsWith<A>(as1: Array<A>, as2: Array<A>): boolean
export function startsWith<A>(as1: Array<A>): (as2: Array<A>) => boolean
export function startsWith<A>(that: Array<A>, what?:Array<A>) {

    const compare = (that: Array<A>, what: Array<A>) => {

        if (isString(what) && isString(that)) {

            return (what as any).startsWith(that)

        } else if (isArray(what) && isArray(that)) {

            return that.length > what.length
                ? false
                : flow(
                    [what as Array<A>, that as Array<A>],
                    zip(),
                    $remove(pairIsSame),
                    size,
                    is(0))

        } else {

            throw 'illegal argument - args must be either both strings or both arrays'
        }
    }

    return what === undefined
        ? (what: Array<A>) => compare(that, what)
        : compare(that, what)
}


const pairIsSame = <A>([a, b]: Pair<A, A>) => a === b


/**
 * tsfun | endsWith
 *
 * Examples:
 *
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/comparator/list/ends_with.spec.ts
 */
export function endsWith<A>(as1: Array<A>, as2: Array<A>): boolean
export function endsWith<A>(as1: Array<A>): (as2: Array<A>) => boolean
export function endsWith<A>(that, as2?) {

    const inner = what => {

        if (isArray(what) && isArray(that)) {

            return that.length > what.length
                ? false
                : flow(
                    [ what as Array<A>, that as Array<A> ],
                    map(reverse),
                    zip(),
                    $remove(pairIsSame),
                    size,
                    is(0))

        } else {

            throw 'illegal argument - args must be either both strings or both arrays'
        }
    }

    return as2 === undefined
        ? inner
        : inner(as2)
}
