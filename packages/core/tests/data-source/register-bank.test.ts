import { describe, test, expect } from 'vitest';
import { registerBank } from '#src/data-sources/register-bank';
import { addBytes } from '#src/utils/data';

describe('DataSource', () => {
  describe('registerBank', () => {
    test('allows access via address or name', () => {
      let dataSource = registerBank([
        { address: 0, name: 'zero' },
        { address: 1, name: 'one' },
      ]);

      expect(dataSource.readByte(0)).toBe(0);
      expect(dataSource.readByte(1)).toBe(0);
      expect(dataSource.values.zero).toBe(0);
      expect(dataSource.values.one).toBe(0);

      dataSource.writeByte(0, 0xff);

      expect(dataSource.readByte(0)).toBe(0xff);
      expect(dataSource.readByte(1)).toBe(0);
      expect(dataSource.values.zero).toBe(0xff);
      expect(dataSource.values.one).toBe(0);

      dataSource.values.one = 1;

      expect(dataSource.readByte(0)).toBe(0xff);
      expect(dataSource.readByte(1)).toBe(1);
      expect(dataSource.values.zero).toBe(0xff);
      expect(dataSource.values.one).toBe(1);
    });

    test('restricts writable bits when a `writeMask` is specified', () => {
      let dataSource = registerBank([{ address: 0, name: 'register', writeMask: 0b11000001 }]);

      expect(dataSource.readByte(0)).toBe(0);
      expect(dataSource.values.register).toBe(0);

      // Set all bits
      dataSource.values.register = 0xff;

      expect(dataSource.readByte(0)).toBe(0xff);
      expect(dataSource.values.register).toBe(0xff);

      // Writing all zeroes only clears bits 0, 6 and 7
      dataSource.writeByte(0, 0);

      expect(dataSource.readByte(0)).toBe(0b00111110);
      expect(dataSource.values.register).toBe(0b00111110);

      // Clear all bits
      dataSource.values.register = 0;

      expect(dataSource.readByte(0)).toBe(0);
      expect(dataSource.values.register).toBe(0);

      // Writing all ones only set bits 0, 6 and 7
      dataSource.writeByte(0, 0xff);

      expect(dataSource.readByte(0)).toBe(0b11000001);
      expect(dataSource.values.register).toBe(0b11000001);
    });

    test('customizes writing when `write` is specified', () => {
      let dataSource = registerBank([{ address: 0, name: 'register', write: (n) => addBytes(n, 1).result }]);

      expect(dataSource.readByte(0)).toBe(0);
      expect(dataSource.values.register).toBe(0);

      dataSource.values.register = 0xff;

      expect(dataSource.readByte(0)).toBe(0xff);
      expect(dataSource.values.register).toBe(0xff);

      dataSource.writeByte(0, 0);

      expect(dataSource.readByte(0)).toBe(0x01);
      expect(dataSource.values.register).toBe(0x01);

      dataSource.writeByte(0, 0xff);

      expect(dataSource.readByte(0)).toBe(0x0);
      expect(dataSource.values.register).toBe(0x0);
    });

    test('customizes reading when `read` is specified', () => {
      let dataSource = registerBank([{ address: 0, name: 'register', read: (n) => addBytes(n, 1).result }]);

      expect(dataSource.readByte(0)).toBe(1);
      expect(dataSource.values.register).toBe(0);

      dataSource.values.register = 0xff;

      expect(dataSource.readByte(0)).toBe(0);
      expect(dataSource.values.register).toBe(0xff);

      dataSource.writeByte(0, 0);

      expect(dataSource.readByte(0)).toBe(0x01);
      expect(dataSource.values.register).toBe(0);

      dataSource.writeByte(0, 0xff);

      expect(dataSource.readByte(0)).toBe(0x0);
      expect(dataSource.values.register).toBe(0xff);
    });
  });
});
