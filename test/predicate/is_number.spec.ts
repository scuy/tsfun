import {isNumber} from '../../src/predicate';


describe('isNumber', () => {

    it('true',() =>
        expect(

            isNumber(4))

            .toEqual(true));


    it('false',() =>
        expect(

            isNumber('3'))

            .toEqual(false));
});