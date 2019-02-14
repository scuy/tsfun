import {getOnOr, setOn} from '../../src/objectstruct';

describe('setOn', () => {


    it('setOn', () => {

        const o: any = {a: 'b'};
        setOn(o, 'a')('d');
        expect(o['a']).toBe('d');
    });


    it('setOn - create path', () => {

        const o: any = {};
        setOn(o,'a')('d');
        expect(o['a']).toBe('d');
    });


    it('setOn - nested', () => {

        const o: any = {a: {b: 'c'}};
        setOn(o, 'a.b')('d');
        expect(o['a']['b']).toBe('d');
    });


    it('setOn - nested - create path', () => {

        const o: any = {};
        setOn(o, 'a.b')('d');
        expect(o['a']['b']).toBe('d');
    });


    it('reimplement takeOrMake', () => {

        const o1: any = {a: {b: {c: 'd'}}};

        const takeOrMake = <T>(o: T, path: string, alternative: any) =>
            setOn(o, path)(getOnOr(path , alternative)(o));

        takeOrMake(o1, 'a.b.c', undefined); // take
        expect(o1['a']['b']['c']).toBe('d');

        const o2: any = {a: {b: {c: undefined}}};

        takeOrMake(o2, 'a.b.c', 'd'); // make
        expect(o2['a']['b']['c']).toBe('d');
    });
});