import { registerBank } from '../../src/data-source/register-bank';

describe('DataSource', () => {
  describe('registerBank', () => {
    test('allows access via address or name', () => {
      let dataSource = registerBank([
        { address: 0, name: 'zero' },
        { address: 1, name: 'one' },
      ]);

      expect(dataSource.readByte(0)).toBe(0);
      expect(dataSource.readByte(1)).toBe(0);
      expect(dataSource.zero).toBe(0);
      expect(dataSource.one).toBe(0);

      dataSource.writeByte(0, 0xff);

      expect(dataSource.readByte(0)).toBe(0xff);
      expect(dataSource.readByte(1)).toBe(0);
      expect(dataSource.zero).toBe(0xff);
      expect(dataSource.one).toBe(0);

      dataSource.one = 1;

      expect(dataSource.readByte(0)).toBe(0xff);
      expect(dataSource.readByte(1)).toBe(1);
      expect(dataSource.zero).toBe(0xff);
      expect(dataSource.one).toBe(1);
    });

    test('restricts writable bits when a `writeMask` is specified', () => {
      let dataSource = registerBank([{ address: 0, name: 'register', writeMask: 0b11000001 }]);

      expect(dataSource.readByte(0)).toBe(0);
      expect(dataSource.register).toBe(0);

      // Set all bits
      dataSource.register = 0xff;

      expect(dataSource.readByte(0)).toBe(0xff);
      expect(dataSource.register).toBe(0xff);

      // Writing all zeroes only clears bits 0, 6 and 7
      dataSource.writeByte(0, 0);

      expect(dataSource.readByte(0)).toBe(0b00111110);
      expect(dataSource.register).toBe(0b00111110);

      // Clear all bits
      dataSource.register = 0;

      expect(dataSource.readByte(0)).toBe(0);
      expect(dataSource.register).toBe(0);

      // Writing all ones only set bits 0, 6 and 7
      dataSource.writeByte(0, 0xff);

      expect(dataSource.readByte(0)).toBe(0b11000001);
      expect(dataSource.register).toBe(0b11000001);
    });
  });
});
