import {identity} from './core'
import {Array6, Either, Fallible, Mapping, Maybe, Pair, Predicate} from './type'
import {isEither, isErr, isFunction, isMaybe, isPair, isOk} from './predicate'
import {first, rest} from './array'
import {success, ok, left, just, right} from './tuple'
import { tripleEqual } from './comparator'



// flow can also be called 'composition'
/**
 * tsfun | flow
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/composition/flow.spec.ts
 */
export function flow<A>(t: A): A
export function flow<A,B>(t: A, f: ((_: A) => B)): B
export function flow<A,B,C>(t: A, f: ((_: A) => B), g: ((_: B) => C)): C
export function flow<A,B,C,D>(t: A, f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D)): D
export function flow<A,B,C,D,E>(t: A, f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E)): E
export function flow<A,B,C,D,E,F>(t: A, f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F)): F
export function flow<A,B,C,D,E,F,G>(t: A, f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F), k: ((_: F) => G)): G
export function flow<A,B,C,D,E,F,G,H>(t: A, f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F), k: ((_: F) => G), l: ((_: G) => H)): H
export function flow<A,B,C,D,E,F,G,H,I>(t: A, f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F), k: ((_: F) => G), l: ((_: G) => H), m: ((_: H) => I)): I
export function flow<A,B,C,D,E,F,G,H,I,J>(t: A, f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F), k: ((_: F) => G), l: ((_: G) => H), m: ((_: H) => I), n: ((_: I) => J)): J
export function flow<A,B,C,D,E,F,G,H,I,J,K>(t: A, f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F), k: ((_: F) => G), l: ((_: G) => H), m: ((_: H) => I), n: ((_: I) => J), o: ((_: J) => K)): K
export function flow<A,B,C,D,E,F,G,H,I,J,K>(t: A, f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F), k: ((_: F) => G), l: ((_: G) => H), m: ((_: H) => I), n: ((_: I) => J), o: ((_: J) => K), ...transformations: Array<Function>): any
export function flow(t: any, ...transformations: Array<Function>): any {

    return (compose as any)(...transformations)(t)
}


/**
 * tsfun | compose
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/composition/compose.spec.ts
 */
export function compose<A,B>(f: (_: A) => B): (_: A) => B
export function compose<A,B,C>(f: ((_: A) => B), g: ((_: B) => C)): (_: A) => C
export function compose<A,B,C,D>(f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D)): (_: A) => D
export function compose<A,B,C,D,E>(f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E)): (_: A) => E
export function compose<A,B,C,D,E,F>(f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F)): (_: A) => F
export function compose<A,B,C,D,E,F,G>(f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F), k: ((_: F) => G)): (_: A) => G
export function compose<A,B,C,D,E,F,G,H>(f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F), k: ((_: F) => G), l: ((_: G) => H)): (_: A) => H
export function compose<A,B,C,D,E,F,G,H,I>(f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F), k: ((_: F) => G), l: ((_: G) => H), m: ((_: H) => I)): (_: A) => I
export function compose<A,B,C,D,E,F,G,H,I,J>(f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F), k: ((_: F) => G), l: ((_: G) => H), m: ((_: H) => I), n: ((_: I) => J)): (_: A) => J
export function compose<A,B,C,D,E,F,G,H,I,J,K>(f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F), k: ((_: F) => G), l: ((_: G) => H), m: ((_: H) => I), n: ((_: I) => J), o: ((_: J) => K)): (_: A) => K
export function compose<A,B,C,D,E,F,G,H,I,J,K>(f: ((_: A) => B), g: ((_: B) => C), h: ((_: C) => D), i: ((_: D) => E), j: ((_: E) => F), k: ((_: F) => G), l: ((_: G) => H), m: ((_: H) => I), n: ((_: I) => J), o: ((_: J) => K), ...transformations: Array<Function>): (_: A) => any
export function compose(...transformations: Array<Function>) {
    return (t: any) =>
        transformations.reduce((acc, transformation) => transformation(acc), t) as any
}


/**
 * tsfun | curry
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/composition/curry.spec.ts
 */
export function curry<A,B,C>(f: (a: A, b: B) => C, b: B): (a: A) => C;
export function curry<A,B,C,D>(f: (a: A, b: B, c: C) => D, b: B, c: C): (a: A) => D;
export function curry<A,B,C,D,E>(f: (a: A, b: B, c: C, d: D) => E, b: B, c: C, d: D): (a: A) => E;
export function curry(f, ...args) {

    return a => f(a, ...args)
}


/**
 * tsfun | nop
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/composition/nop.spec.ts
 */
export function nop() {}


/**
 * tsfun | val
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/composition/val.spec.ts
 */
export function val<A>(v: A) { return () => v as A }


/**
 * tsfun | throws
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/composition/throws.spec.ts
 */
export function throws(e1?: any) {

    return (e2?: any): any => { throw e1 ? e1 : e2 }
}


/**
 * tsfun | collect
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/composition/collect.spec.ts
 */
export function collect<T>(...p: Array<T>) {

    return p
}


/**
 * tsfun | apply
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/composition/apply.spec.ts
 */
 export function apply<A,B,C>(f: (a: A, b: B) => C): (args: any) => C;
 export function apply<A,B,C,D>(f: (a: A, b: B, c: C) => D): (args: any) => D;
 export function apply<A,B,C,D,E>(f: (a: A, b: B, c: C, d: D) => E): (args: any) => E;
 export function apply<A,B,C,D,E,F>(f: (a: A, b: B, c: C, d: D, e: E) => F): (args: any) => F;
 export function apply<A,B,C,D,E,F,G>(f: (a: A, b: B, c: C, d: D, e: E, f: F) => G): (args: any) => G;
 export function apply<A,B,C,D,E,F,G,H>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H): (args: any) => G;
 export function apply<A,B,C,D,E,F,G,H,I>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, ...hs: any) => I): (args: any) => I;
 export function apply(f: any) {

     return (args: any[]) => f.apply(undefined, args)
 }


/**
 * tsfun | mcompose
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/composition/mcompose.spec.ts
 */
export function mcompose<T, R>(...fs: Array<(x: T, ...xs: Array<T>) => Either<any, T>>)
    : (seed: Either<any, T>) => Either<any, R>
export function mcompose<T, R>(...fs: Array<(x: T, ...xs: Array<T>) => Maybe<T>>)
    : (seed: Maybe<T>) => Maybe<R>
export function mcompose<T, R>(...fs: Array<(x: T, ...xs: Array<T>) => Either<any, T>|Maybe<T>>)
    : (seed: Either<any, T>|Maybe<T>) => Maybe<R>|Either<any, R> {

    return (seed: Maybe<T>|Either<any, T>) => {
        if (isErr(seed)) return seed as any

        let results = [ok(seed)] as Array<T>
        for (let f of fs) {

            const res = f(first(results) as T, ...rest(results))
            if (isErr(res)) return res as any
            results = [ok(res)].concat(results)
        }
        return convert(first(results), seed) as any
    }
}


/**
 * tsfun | mmatch
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/composition/mmatch.spec.ts
 */
export function mmatch<T, R>(onSuccess: (x: T) => R,
                             onFailure: () => R) {

    return (m: Maybe<T>) =>
        isOk(m)
            ? onSuccess((m as any)[0])
            : onFailure()

}


/**
 * tsfun | cond
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/composition/cond.spec.ts
 */
 export function cond<A, B, C>(
    p: boolean|Predicate<A>,
    f: Mapping<A, B>|B,
    g: Mapping<A, C>|C
        = identity as (_: A) => C)
    : (v: A) => B|C {

    return (v: A) => {

        return (typeof p === 'function' ? p(v) : p)
            ? typeof f === 'function' ? (f as Mapping<A,B>)(v) : f
            : typeof g === 'function' ? (g as Mapping<A,C>)(v) : g
    }
}


/**
 * tsfun | conds
 * https://github.com/danielmarreirosdeoliveira/tsfun/blob/master/test/composition/conds.spec.ts
 */
export function conds<A,B>(...cs: Array6<Pair<Predicate<A>, Mapping<A,B>>>): (what: A) => B
export function conds<A,B>(...cs: Array6<Pair<Predicate<A>,B>>): (what: A) => B
export function conds<A,B>(...cs: Array6<Pair<A,Mapping<A,B>>>): (what: A) => B
export function conds<A,B>(...cs: Array6<Pair<A,B>>): (what: A) => B
export function conds<A,B>(c1: Predicate<A>, d1: Mapping<A,B>, c2: Predicate<A>, d2: Mapping<A,B>, c3: Predicate<A>, d3: Mapping<A,B>, c4: Predicate<A>, d4: Mapping<A,B>, c5: Predicate<A>, d5: Mapping<A,B>): (what: A) => B
export function conds<A,B>(c1: Predicate<A>, d1: Mapping<A,B>, c2: Predicate<A>, d2: Mapping<A,B>, c3: Predicate<A>, d3: Mapping<A,B>, c4: Predicate<A>, d4: Mapping<A,B>): (what: A) => B
export function conds<A,B>(c1: Predicate<A>, d1: Mapping<A,B>, c2: Predicate<A>, d2: Mapping<A,B>, c3: Predicate<A>, d3: Mapping<A,B>): (what: A) => B
export function conds<A,B>(c1: Predicate<A>, d1: Mapping<A,B>, c2: Predicate<A>, d2: Mapping<A,B>): (what: A) => B
export function conds<A,B>(c1: Predicate<A>, d1: B, c2: Predicate<A>, d2: B, c3: Predicate<A>, d3: B, c4: Predicate<A>, d4: B, c5: Predicate<A>, d5: B): (what: A) => B
export function conds<A,B>(c1: Predicate<A>, d1: B, c2: Predicate<A>, d2: B, c3: Predicate<A>, d3: B, c4: Predicate<A>, d4: B): (what: A) => B
export function conds<A,B>(c1: Predicate<A>, d1: B, c2: Predicate<A>, d2: B, c3: Predicate<A>, d3: B): (what: A) => B
export function conds<A,B>(c1: Predicate<A>, d1: B, c2: Predicate<A>, d2: B): (what: A) => B
export function conds<A,B>(c1: A, d1: Mapping<A,B>, c2: A, d2: Mapping<A,B>, c3: A, d3: Mapping<A,B>, c4: A, d4: Mapping<A,B>, c5: A, d5: Mapping<A,B>): (what: A) => B
export function conds<A,B>(c1: A, d1: Mapping<A,B>, c2: A, d2: Mapping<A,B>, c3: A, d3: Mapping<A,B>, c4: A, d4: Mapping<A,B>): (what: A) => B
export function conds<A,B>(c1: A, d1: Mapping<A,B>, c2: A, d2: Mapping<A,B>, c3: A, d3: Mapping<A,B>): (what: A) => B
export function conds<A,B>(c1: A, d1: Mapping<A,B>, c2: A, d2: Mapping<A,B>): (what: A) => B
export function conds<A,B>(c1: A, d1: B, c2: A, d2: B, c3: A, d3: B, c4: A, d4: B, c5: A, d5: B): (what: A) => B
export function conds<A,B>(c1: A, d1: B, c2: A, d2: B, c3: A, d3: B, c4: A, d4: B): (what: A) => B
export function conds<A,B>(c1: A, d1: B, c2: A, d2: B, c3: A, d3: B): (what: A) => B
export function conds<A,B>(c1: A, d1: B, c2: A, d2: B): (what: A) => B
export function conds(...args) {

    return $conds(tripleEqual, ...args)
}


export function condsBy(comp) {

    return ((...args) => $conds(comp, ...args)) as typeof conds;
}


export const otherwise: any = val(true)


function $conds(comp, ...args) {

    return (what: any) => {

        let cs: Array<Pair> = [];
        if (args.filter(isPair).length === args.length) {
            cs = args;
        } else {
            if (args.length % 2 !== 0) throw 'illegal args - arguments must come pairwise'
            for (let i = 0; i < args.length; i=i+2) {
                cs.push([args[i], args[i+1]])
            }
        }

        for (let c of cs) {

            const rightC = right(c) // avoid calling it twice
            const r = () => isFunction(rightC) ? rightC(what) : rightC

            const leftC = left(c); // same
            if (isFunction(leftC)) {
                if (leftC(what)) return r()
            } else {
                if (comp(leftC)(what)) return r()
            }
        }
        throw 'case exception - try using \'otherwise\' in conds'
    }
}


export function convert<T>(what: any, basedOn: Fallible<T>): any {

    if (!isEither(basedOn) && !isMaybe(basedOn)) throw 'illegal argument - basedOn is neither Maybe nor Either';
    return isEither(basedOn)
        ? success(what)
        : just(what)
}
