import { nil } from '../../src/data-source/nil';

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
});
