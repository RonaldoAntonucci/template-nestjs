import { HashProvider } from './hash.provider';

describe('BcryptHashProvider', () => {
    const sut = new HashProvider();
    it('should be able to hash value.', async () => {
        const result = await sut.hash('value');
        expect(result).toBeTruthy();
    });

    it('should be return true if values match.', async () => {
        const result = await sut.compare(
            'value',
            '$argon2id$v=19$m=65536,t=3,p=4$f57GhJPb1p/KdSBcvqukrg$HeH4ndYJbT9/kdBTsHamjoVIhL+DHwbLnYjXF6MofSI',
        );
        expect(result).toBe(true);
    });
    it('should be return false if values match.', async () => {
        const result = await sut.compare(
            'value_not_match',
            '$argon2id$v=19$m=65536,t=3,p=4$f57GhJPb1p/KdSBcvqukrg$HeH4ndYJbT9/kdBTsHamjoVIhL+DHwbLnYjXF6MofSI',
        );
        expect(result).toBe(false);
    });
});
