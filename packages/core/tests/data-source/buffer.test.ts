import { buffer } from '../../src/data-source/buffer';

describe('DataSource', () => {
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
});
