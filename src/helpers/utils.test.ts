import { difference } from './utils';

describe('Utils/difference', () => {
  it('should return the difference between two objects with numeric values', () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { a: 1, b: 2, c: 4 };
    const result = difference(obj1, obj2);
    expect(result).toEqual({ c: 4 });
  });

  it('should return the difference between two objects with new properties and strings', () => {
    const obj1 = { a: 1, c: '' };
    const obj2 = { a: 1, b: '', c: 'ciao' };
    const result = difference(obj1, obj2);
    expect(result).toEqual({ b: '', c: 'ciao' });
  });

  it('should return the difference between two objects from null or undefined', () => {
    const obj1 = { a: 1, c: null };
    const obj2 = { a: 1, b: '', c: 'ciao' };
    const result = difference(obj1, obj2);
    expect(result).toEqual({ b: '', c: 'ciao' });
  });

  it('should return the difference between two objects with lists', () => {
    const obj1 = { a: [], b: 'thesame' };
    const obj2 = { a: ['alpha', 'beta', 'gamma'], b: 'thesame' };
    const result = difference(obj1, obj2);
    expect(result).toEqual({ a: ['alpha', 'beta', 'gamma'] });
  });
});
