import {defined, isDefined, isUndefined} from '../../src/predicate';


describe('isDefined / defined / isUndefined', () => {

    it('isDefined',() =>
        expect(

            isDefined(true))

            .toEqual(true));


    it('defined',() =>
        expect(

            defined(true))

            .toEqual(true));


    it('isFalse',() =>
        expect(

            isUndefined(undefined))

            .toEqual(true));
});