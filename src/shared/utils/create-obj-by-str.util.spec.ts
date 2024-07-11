import { createObjByStr } from 'src/shared/utils/create-obj-by-str.util';

describe('createObjByStr', () => {
    it('should create an object with nested properties based on the input string', () => {
        const str = 'teste1.teste2.teste3.teste4';
        const expectedObj = {
            teste1: {
                teste2: {
                    teste3: {
                        teste4: true,
                    },
                },
            },
        };

        const result = createObjByStr(str);

        expect(result).toEqual(expectedObj);
    });

    it('should create an object with a single property if there are no nested properties', () => {
        const str = 'empresa';
        const expectedObj = {
            empresa: true,
        };

        const result = createObjByStr(str);

        expect(result).toEqual(expectedObj);
    });
});
