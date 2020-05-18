import {filter as asyncFilter} from '../../../src/async';


const asyncSmaller4 = (_: number) => Promise.resolve(_ < 4);

/**
 * tsfun | async/filter
 *
 * @author Daniel de Oliveira
 */
describe('async/filter', () => {

    it('array', async done => {

        expect(

            await asyncFilter(asyncSmaller4)([2, 4, 3]))

            .toEqual([2, 3]);

        done();
    });


    it('object', async done => {

        expect(

            await asyncFilter(asyncSmaller4)({a: 2, b: 4, c: 3}))

            .toEqual({a: 2, c: 3});

        done();
    });


    it('string', async done => {

        expect(

            await asyncFilter((a: string) => Promise.resolve(a > 'a'))('abad'))

            .toEqual('bd');

        done();
    });
});