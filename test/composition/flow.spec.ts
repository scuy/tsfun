import {greaterThan, includedIn, lessThan} from '../../src/comparator';
import {flow} from '../../src/composition';
import {dropRight, dropWhile, reverse, takeWhile} from '../../src/arraylist';
import {uniteObj} from '../../src/objectset';
import {isNot} from '../../src/predicate';


/**
 * A `flow` is a series of transformations of some
 * instance of type `A` to another instance
 * of type `A`.
 *
 * The design goal of a flow was to provide a way to mix
 * javascript functional style
 * methods like `map` and `filter`, with other functional
 * style methods like `takeWhile`
 * in a way which feels as natural as possible,
 * given that we do not want to mix in new methods
 * into the Array prototype. See intented use cases.
 *
 * A flow has not necessarily to be of type `Array`,
 * it works on any
 * type `A`. It is just that `tsfun` itself
 * provides many array manipulating functions which
 * are designed with flow in mind.
 *
 * @author Daniel de Oliveira
 */
describe('flow', () => {


    it('flow', () =>
        expect(

            flow([5,4],
                takeWhile(greaterThan(4))))

        .toEqual([5]));


    it('flow - no steps', () =>
        expect(

            flow(
                [5,6]))

        .toEqual([5,6]));


    it('reverse ', () =>
        expect(

            reverse([1, 3]))

        .toEqual(([3, 1])));


    it('dropWhile', () =>
        expect(

            flow(
                [7, 9, 10, 13, 21, 20],
                dropWhile(lessThan(20)),
                reverse))

            .toEqual([20, 21]));


    it('with objects', () =>
        expect(

            flow(
                {a: 1, b: 2},
                uniteObj({c: 3})))

            .toEqual({a: 1, b: 2, c: 3}));


    // intended use case

    // In the example above we feed the flow with an array, and then transform this array step
    // by step, first within the flow, using `takeWhile` and `dropRight`. The result is an array,
    // which then is beeing transformed again with the native `map` function. Finally `includes`
    // is called on it to obtain a `boolean` result. As we see, it lets us seemingly 'pipe'
    // things across the borders of the flow.

    it('intended use case', () =>
        expect(

            flow(
                [1, 2, 3, 1],
                takeWhile(isNot(includedIn([3, 4]))),
                dropRight(1))
                .map((x: number) => x * 2)
                .includes(2))

            .toEqual(true));
});


