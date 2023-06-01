import { expect } from '@open-wc/testing';
import { uuid } from './index';

describe('utils', () => {
    it('get default nanoid', () => {
        const id = uuid();
        expect(id).to.be.a('string');
        expect(id.length).to.equal(10);
    });
    it('get custom length nanoid', () => {
        expect(uuid(5).length).to.equal(5);
    });
});
