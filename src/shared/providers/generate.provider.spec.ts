import { GenerateProvider } from './generate.provider';

describe('GenerateProvider', () => {
    const sut = new GenerateProvider();
    it('should be able to generate a uuid.', () => {
        const result = sut.uuid();
        expect(result).toBeTruthy();
    });
});
