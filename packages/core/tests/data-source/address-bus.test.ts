import AddressBus from '../../src/data-source/address-bus';
import { nil } from '../../src/data-source/nil';
import { buffer } from '../../src/data-source/buffer';
import { byte } from '../../src/utils/sized-numbers';

describe('AddressBus', () => {
  test('rejects overlapping mappings', () => {
    expect(() => {
      new AddressBus([
        { offset: 0, length: 4, data: nil() },
        { offset: 3, length: 1, data: nil() },
      ]);
    }).toThrow('Address mapping overlap at 0x3');
  });

  test('throws when accessing an unmapped address', () => {
    let bus = new AddressBus([{ offset: 0, length: 4, data: nil() }]);
    expect(() => bus.readByte(0x10)).toThrow('Access of unmapped address 0x10');
  });

  test('reads from mapped locations', () => {
    let a = buffer(0x10);
    let b = buffer(0x10);
    let bus = new AddressBus([
      { offset: 0, length: 0x10, data: a },
      { offset: 0x10, length: 0x10, data: b },
    ]);

    for (let i = 0; i < 0x10; i++) {
      a.writeByte(i, byte(Math.floor(Math.random() * 0xff)));
      b.writeByte(i, byte(Math.floor(Math.random() * 0xff)));
    }

    for (let i = 0; i < 0x10; i++) {
      expect(bus.readByte(i)).toBe(a.readByte(i));
      expect(bus.readByte(i + 0x10)).toBe(b.readByte(i));
    }
  });

  test('writes to mapped locations', () => {
    let a = buffer(0x10);
    let b = buffer(0x10);
    let bus = new AddressBus([
      { offset: 0, length: 0x10, data: a },
      { offset: 0x10, length: 0x10, data: b },
    ]);

    for (let i = 0; i < 0x20; i++) {
      bus.writeByte(i, byte(i));
    }

    for (let i = 0; i < 0x10; i++) {
      expect(a.readByte(i)).toBe(i);
      expect(b.readByte(i)).toBe(i + 0x10);
    }
  });
});
