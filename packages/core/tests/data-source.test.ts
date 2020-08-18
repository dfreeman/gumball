import { nil, buffer, registerBank } from '../src/data-source';

describe('DataSource', () => {
  describe('nil', () => {
    test('returns 0 on read', () => {
      let dataSource = nil();
      expect(dataSource.readByte(0)).toBe(0);
      expect(dataSource.readByte(0xffff)).toBe(0);
    });

    test('ignores writes', () => {
      let dataSource = nil();
      dataSource.writeByte(0, 0xff);
      expect(dataSource.readByte(0)).toBe(0);
    });
  });

  describe('buffer', () => {
    test('reflects reads and writes in the underlying buffer', () => {
      let dataSource = buffer(2);

      expect(dataSource.readByte(0)).toBe(0);
      expect(dataSource.readByte(1)).toBe(0);
      expect(dataSource.readByte(2)).toBe(undefined);
      expect([...dataSource.buffer]).toEqual([0, 0]);

      dataSource.writeByte(1, 0xff);

      expect(dataSource.readByte(0)).toBe(0);
      expect(dataSource.readByte(1)).toBe(0xff);
      expect([...dataSource.buffer]).toEqual([0, 0xff]);

      dataSource.buffer[0] = 0xf0;

      expect(dataSource.readByte(0)).toBe(0xf0);
      expect(dataSource.readByte(1)).toBe(0xff);
      expect([...dataSource.buffer]).toEqual([0xf0, 0xff]);
    });

    test('reflects data in a pre-existing buffer', () => {
      let underlying = new Uint8Array(2);
      let dataSource = buffer(underlying);

      underlying[0] = 0xfe;
      underlying[1] = 0xef;

      expect(dataSource.readByte(0)).toBe(0xfe);
      expect(dataSource.readByte(1)).toBe(0xef);

      dataSource.writeByte(0, 0x01);
      dataSource.writeByte(1, 0xff);

      expect(underlying[0]).toBe(0x01);
      expect(underlying[1]).toBe(0xff);
    });
  });

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
