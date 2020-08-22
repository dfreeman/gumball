import { buffer } from '../../src/data-source/buffer';
import { guarded } from '../../src/data-source/guarded';

describe('DataSource', () => {
  test('guarded', () => {
    let dataSource = guarded(buffer(1));

    dataSource.inner.writeByte(0, 0xff);

    expect(dataSource.readByte(0)).toBe(0xff);

    dataSource.lock(0x00);

    expect(dataSource.inner.readByte(0)).toBe(0xff);
    expect(dataSource.readByte(0)).toBe(0x00);

    dataSource.writeByte(0, 0x01);

    expect(dataSource.inner.readByte(0)).toBe(0xff);
    expect(dataSource.readByte(0)).toBe(0x00);

    dataSource.unlock();

    expect(dataSource.inner.readByte(0)).toBe(0xff);
    expect(dataSource.readByte(0)).toBe(0xff);

    dataSource.lock(0x01);

    expect(dataSource.inner.readByte(0)).toBe(0xff);
    expect(dataSource.readByte(0)).toBe(0x01);
  });
});
