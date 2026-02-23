import { Byte, Bit, Word, byte, bit, word } from '#src/utils/sized-numbers';
import DataSource from '#src/data-source';

export function addBytes(a: Byte, b: Byte): { result: Byte; h: Bit; c: Bit; z: Bit } {
  let raw = a + b;
  let result = byte(raw);
  let c = bit(raw > 0xff);
  let z = bit(result === 0);
  let h = bit((a & 0xf) + (b & 0xf) > 0xf);
  return { result, h, c, z };
}

export function addBytesCarry(a: Byte, b: Byte, carry: Bit): { result: Byte; h: Bit; c: Bit; z: Bit } {
  let raw = a + b + carry;
  let result = byte(raw);
  let c = bit(raw > 0xff);
  let z = bit(result === 0);
  let h = bit((a & 0xf) + (b & 0xf) + carry > 0xf);
  return { result, h, c, z };
}

export function subtractBytes(a: Byte, b: Byte): { result: Byte; h: Bit; c: Bit; z: Bit } {
  let raw = a - b;
  let result = byte(raw);
  let c = bit(raw < 0);
  let z = bit(result === 0);
  let h = bit((a & 0xf) - (b & 0xf) < 0);
  return { result, h, c, z };
}

export function subtractBytesCarry(a: Byte, b: Byte, carry: Bit): { result: Byte; h: Bit; c: Bit; z: Bit } {
  let raw = a - b - carry;
  let result = byte(raw);
  let c = bit(raw < 0);
  let z = bit(result === 0);
  let h = bit((a & 0xf) - (b & 0xf) - carry < 0);
  return { result, h, c, z };
}

export function addWords(a: Word, b: Word): { result: Word; h: Bit; c: Bit; z: Bit } {
  let raw = a + b;
  let result = word(raw);
  let c = bit(raw > 0xffff);
  let z = bit(result === 0);
  let h = bit((a & 0xfff) + (b & 0xfff) > 0xfff);
  return { result, c, z, h };
}

export function subtractWords(a: Word, b: Word): { result: Word; h: Bit; c: Bit; z: Bit } {
  let raw = a - b;
  let result = word(raw);
  let c = bit(raw < 0);
  let z = bit(result === 0);
  let h = bit((a & 0xfff) - (b & 0xfff) < 0);
  return { result, c, z, h };
}

export function rotateLeft(value: Byte, fill?: Bit): { result: Byte; c: Bit; z: Bit } {
  let shifted = value << 1;
  let c = bit(shifted & 0x100);
  let result = byte((shifted & 0xff) | (typeof fill === 'undefined' ? c : fill));
  let z = bit(result === 0);
  return { result, c, z };
}

export function rotateRight(value: Byte, fill?: Bit): { result: Byte; c: Bit; z: Bit } {
  let shifted = value >>> 1;
  let c = bit(value & 0x01);
  let result = byte(shifted | ((typeof fill === 'undefined' ? c : fill) << 7));
  let z = bit(result === 0);
  return { result, c, z };
}

export function shiftLeftA(value: Byte): { result: Byte; c: Bit; z: Bit } {
  let result = byte(value << 1);
  let c = bit(value & 0x80);
  let z = bit(result === 0);
  return { result, c, z };
}

export function shiftRightA(value: Byte): { result: Byte; c: Bit; z: Bit } {
  let result = byte((value >> 1) | (value & 0x80));
  let z = bit(result === 0);
  return { result, c: 0, z };
}

export function shiftRightL(value: Byte): { result: Byte; c: Bit; z: Bit } {
  let result = byte(value >> 1);
  let c = bit(value & 0x01);
  let z = bit(result === 0);
  return { result, c, z };
}

export function swap(value: Byte): { result: Byte; c: Bit; z: Bit } {
  let lo = value & 0x0f;
  let hi = value & 0xf0;
  let result = byte((lo << 4) | (hi >> 4));
  let z = bit(result === 0);
  return { result, c: 0, z };
}

// Explanation at https://ehaskins.com/2018-01-30%20Z80%20DAA/
// Implementation ported from https://forums.nesdev.com/viewtopic.php?f=20&t=15944
export function decimalAdjust(value: Byte, n: Bit, h: Bit, c: Bit): { result: Byte; overflow: Bit } {
  let result: Byte = value;
  let overflow: Bit = c;

  if (!n) {
    // after an addition, adjust if (half-)carry occurred or if result is out of bounds
    if (c || result > 0x99) {
      result = byte(result + 0x60);
      overflow = 1;
    }

    if (h || (result & 0x0f) > 0x09) {
      result = byte(result + 0x06);
    }
  } else {
    // after a subtraction, only adjust if (half-)carry occurred
    if (c) {
      result = byte(result - 0x60);
    }

    if (h) {
      result = byte(result - 0x06);
    }
  }

  return { result, overflow };
}

export function addSignedOffset(value: Word, offset: Byte): { result: Word; z: Bit; h: Bit; c: Bit } {
  let signedOffset = signedByte(offset);
  let op = signedOffset < 0 ? subtractWords : addWords;
  return op(value, word(Math.abs(signedOffset)));
}

export function signedByte(value: Byte): number {
  return value > 127 ? -((~value + 1) & 0xff) : value;
}

export function readWord(data: DataSource, address: number): Word {
  return (data.readByte(address) + (data.readByte(address + 1) << 8)) as Word;
}

export function writeWord(data: DataSource, address: number, value: Word): void {
  data.writeByte(address, (value & 0xff) as Byte);
  data.writeByte(address + 1, ((value >> 8) & 0xff) as Byte);
}
