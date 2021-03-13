import {lookup, path} from "../../src/struct"

/**
 * tsfun | lookup
 */
describe('lookup', () => {

    it('first level object - second level object',() =>
        expect(

            lookup({a: {b: 4}})(path('a.b')))

            .toEqual(4));


    it('first level object - second level object - by array',() =>
        expect(

            lookup({a: {b: 4}})(['a', 'b']))

            .toEqual(4));


    it('first level object - second level array',() =>
        expect(

            lookup({a: [4, 5]})(path('a[1]')))

            .toEqual(5));


    it('fist level array - second level object',() =>
        expect(

            lookup([4, {d: 7}])(path('[1].d')))

            .toEqual(7));


    it('fist level array - second level array',() =>
        expect(

            lookup([4, [7, 8]])(path('[1][0]')))

            .toEqual(7));


    it('undefined as key',() =>
        expect(

            lookup([4, [7, 8]])(undefined as any))

            .toBeUndefined());


    it('nothing array', () =>
        expect(

            lookup([4])(path('[5]')))

            .toBeUndefined());


    it('nothing object',() =>
        expect(

            lookup({a: {b: 4}})(path('c.d')))

            .toBeUndefined());


    it('alternative',() =>
        expect(

            lookup([4], 7)(path('[5]')))

            .toEqual(7));


    it('first level object - second level object - see path',() =>
        expect(

            lookup({'a.b': 4})('a.b'))

            .toEqual(4));
});
