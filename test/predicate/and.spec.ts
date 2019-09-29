import {and} from '../../src/predicate';
import {greaterThan, is, isnt} from '../../src/comparator';
import {isNot} from 'tsfun-core/src/predicate';
import {filter} from '../../src/arraylist';


describe('and', () => {


    it('true', () =>
       expect(

           and(is(3), isnt(4))(3)

       ).toBe(true));


    it('false', () =>
        expect(

            and(is(3), isnt(4))(4)

        ).toBe(false));


    // use case

    it('use case', () =>
        expect(

            filter(
                and(
                    greaterThan(1),
                    isNot(greaterThan(4))))([1, 2, 3, 4, 5])

        ).toEqual([2, 3, 4]));
});