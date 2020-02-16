import {left} from '../../src/composition';


describe('left', () => {

    it('left', () =>
        expect(

            left([4, 5])

        ).toEqual(4));


    it('undefined', () =>
        expect(

            () => left([] as any)

        ).toThrowError());
});