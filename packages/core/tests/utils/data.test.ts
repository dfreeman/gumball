import { test, expect } from 'vitest';
import { byte, word } from '#src/utils/sized-numbers';
import { buffer } from '#src/data-sources/buffer';
import {
  addBytes,
  subtractBytes,
  addWords,
  subtractWords,
  rotateLeft,
  rotateRight,
  readWord,
  writeWord,
  signedByte,
  decimalAdjust,
  addBytesCarry,
  subtractBytesCarry,
  addSignedOffset,
  shiftLeftA,
  shiftRightA,
  shiftRightL,
  swap,
} from '#src/utils/data';

test('addBytes', () => {
  expect(addBytes(byte(0x00), byte(0x00))).toEqual({ result: 0x00, h: 0, c: 0, z: 1 });
  expect(addBytes(byte(0xff), byte(0xff))).toEqual({ result: 0xfe, h: 1, c: 1, z: 0 });
  expect(addBytes(byte(0x80), byte(0x80))).toEqual({ result: 0x00, h: 0, c: 1, z: 1 });
  expect(addBytes(byte(0x0e), byte(0x01))).toEqual({ result: 0x0f, h: 0, c: 0, z: 0 });
  expect(addBytes(byte(0x0f), byte(0x01))).toEqual({ result: 0x10, h: 1, c: 0, z: 0 });
});

test('addBytesCarry', () => {
  expect(addBytesCarry(byte(0x00), byte(0x00), 0)).toEqual({ result: 0x00, h: 0, c: 0, z: 1 });
  expect(addBytesCarry(byte(0xff), byte(0xff), 0)).toEqual({ result: 0xfe, h: 1, c: 1, z: 0 });
  expect(addBytesCarry(byte(0x80), byte(0x80), 0)).toEqual({ result: 0x00, h: 0, c: 1, z: 1 });
  expect(addBytesCarry(byte(0x0e), byte(0x01), 0)).toEqual({ result: 0x0f, h: 0, c: 0, z: 0 });
  expect(addBytesCarry(byte(0x0f), byte(0x01), 0)).toEqual({ result: 0x10, h: 1, c: 0, z: 0 });

  expect(addBytesCarry(byte(0x00), byte(0x00), 1)).toEqual({ result: 0x01, h: 0, c: 0, z: 0 });
  expect(addBytesCarry(byte(0xff), byte(0xff), 1)).toEqual({ result: 0xff, h: 1, c: 1, z: 0 });
  expect(addBytesCarry(byte(0x80), byte(0x80), 1)).toEqual({ result: 0x01, h: 0, c: 1, z: 0 });
  expect(addBytesCarry(byte(0x0e), byte(0x01), 1)).toEqual({ result: 0x10, h: 1, c: 0, z: 0 });
  expect(addBytesCarry(byte(0x0f), byte(0x01), 1)).toEqual({ result: 0x11, h: 1, c: 0, z: 0 });
});

test('subtractBytes', () => {
  expect(subtractBytes(byte(0x00), byte(0x00))).toEqual({ result: 0x00, h: 0, c: 0, z: 1 });
  expect(subtractBytes(byte(0xff), byte(0xff))).toEqual({ result: 0x00, h: 0, c: 0, z: 1 });
  expect(subtractBytes(byte(0x80), byte(0x01))).toEqual({ result: 0x7f, h: 1, c: 0, z: 0 });
  expect(subtractBytes(byte(0x81), byte(0x01))).toEqual({ result: 0x80, h: 0, c: 0, z: 0 });
  expect(subtractBytes(byte(0x10), byte(0x20))).toEqual({ result: 0xf0, h: 0, c: 1, z: 0 });
  expect(subtractBytes(byte(0x01), byte(0x02))).toEqual({ result: 0xff, h: 1, c: 1, z: 0 });
});

test('subtractBytesCarry', () => {
  expect(subtractBytesCarry(byte(0x00), byte(0x00), 0)).toEqual({ result: 0x00, h: 0, c: 0, z: 1 });
  expect(subtractBytesCarry(byte(0xff), byte(0xff), 0)).toEqual({ result: 0x00, h: 0, c: 0, z: 1 });
  expect(subtractBytesCarry(byte(0x80), byte(0x01), 0)).toEqual({ result: 0x7f, h: 1, c: 0, z: 0 });
  expect(subtractBytesCarry(byte(0x81), byte(0x01), 0)).toEqual({ result: 0x80, h: 0, c: 0, z: 0 });
  expect(subtractBytesCarry(byte(0x10), byte(0x20), 0)).toEqual({ result: 0xf0, h: 0, c: 1, z: 0 });
  expect(subtractBytesCarry(byte(0x01), byte(0x02), 0)).toEqual({ result: 0xff, h: 1, c: 1, z: 0 });

  expect(subtractBytesCarry(byte(0x00), byte(0x00), 1)).toEqual({ result: 0xff, h: 1, c: 1, z: 0 });
  expect(subtractBytesCarry(byte(0xff), byte(0xff), 1)).toEqual({ result: 0xff, h: 1, c: 1, z: 0 });
  expect(subtractBytesCarry(byte(0x80), byte(0x01), 1)).toEqual({ result: 0x7e, h: 1, c: 0, z: 0 });
  expect(subtractBytesCarry(byte(0x81), byte(0x01), 1)).toEqual({ result: 0x7f, h: 1, c: 0, z: 0 });
  expect(subtractBytesCarry(byte(0x10), byte(0x20), 1)).toEqual({ result: 0xef, h: 1, c: 1, z: 0 });
  expect(subtractBytesCarry(byte(0x01), byte(0x02), 1)).toEqual({ result: 0xfe, h: 1, c: 1, z: 0 });
});

test('addWords', () => {
  expect(addWords(word(0x0000), word(0x0000))).toEqual({ result: 0x0000, h: 0, c: 0, z: 1 });
  expect(addWords(word(0xffff), word(0xffff))).toEqual({ result: 0xfffe, h: 1, c: 1, z: 0 });
  expect(addWords(word(0x8000), word(0x8000))).toEqual({ result: 0x0000, h: 0, c: 1, z: 1 });
  expect(addWords(word(0x0e00), word(0x0100))).toEqual({ result: 0x0f00, h: 0, c: 0, z: 0 });
  expect(addWords(word(0x0f00), word(0x0100))).toEqual({ result: 0x1000, h: 1, c: 0, z: 0 });
});

test('subtractWords', () => {
  expect(subtractWords(word(0x0000), word(0x0000))).toEqual({ result: 0x0000, h: 0, c: 0, z: 1 });
  expect(subtractWords(word(0xffff), word(0xffff))).toEqual({ result: 0x0000, h: 0, c: 0, z: 1 });
  expect(subtractWords(word(0x8000), word(0x0100))).toEqual({ result: 0x7f00, h: 1, c: 0, z: 0 });
  expect(subtractWords(word(0x8100), word(0x0100))).toEqual({ result: 0x8000, h: 0, c: 0, z: 0 });
  expect(subtractWords(word(0x1000), word(0x2000))).toEqual({ result: 0xf000, h: 0, c: 1, z: 0 });
  expect(subtractWords(word(0x0100), word(0x0200))).toEqual({ result: 0xff00, h: 1, c: 1, z: 0 });
});

test('rotateLeft', () => {
  expect(rotateLeft(byte(0b00000000))).toEqual({ result: 0b00000000, c: 0, z: 1 });
  expect(rotateLeft(byte(0b11111111))).toEqual({ result: 0b11111111, c: 1, z: 0 });
  expect(rotateLeft(byte(0b10000000))).toEqual({ result: 0b00000001, c: 1, z: 0 });
  expect(rotateLeft(byte(0b00000001))).toEqual({ result: 0b00000010, c: 0, z: 0 });
  expect(rotateLeft(byte(0b01111111))).toEqual({ result: 0b11111110, c: 0, z: 0 });
  expect(rotateLeft(byte(0b11111110))).toEqual({ result: 0b11111101, c: 1, z: 0 });
  expect(rotateLeft(byte(0b10101010))).toEqual({ result: 0b01010101, c: 1, z: 0 });
  expect(rotateLeft(byte(0b01010101))).toEqual({ result: 0b10101010, c: 0, z: 0 });

  expect(rotateLeft(byte(0b00000000), 1)).toEqual({ result: 0b00000001, c: 0, z: 0 });
  expect(rotateLeft(byte(0b11111111), 0)).toEqual({ result: 0b11111110, c: 1, z: 0 });
  expect(rotateLeft(byte(0b10000000), 0)).toEqual({ result: 0b00000000, c: 1, z: 1 });
  expect(rotateLeft(byte(0b00000001), 1)).toEqual({ result: 0b00000011, c: 0, z: 0 });
  expect(rotateLeft(byte(0b01111111), 1)).toEqual({ result: 0b11111111, c: 0, z: 0 });
  expect(rotateLeft(byte(0b11111110), 0)).toEqual({ result: 0b11111100, c: 1, z: 0 });
  expect(rotateLeft(byte(0b10101010), 0)).toEqual({ result: 0b01010100, c: 1, z: 0 });
  expect(rotateLeft(byte(0b01010101), 1)).toEqual({ result: 0b10101011, c: 0, z: 0 });
});

test('rotateRight', () => {
  expect(rotateRight(byte(0b00000000))).toEqual({ result: 0b00000000, c: 0, z: 1 });
  expect(rotateRight(byte(0b11111111))).toEqual({ result: 0b11111111, c: 1, z: 0 });
  expect(rotateRight(byte(0b10000000))).toEqual({ result: 0b01000000, c: 0, z: 0 });
  expect(rotateRight(byte(0b00000001))).toEqual({ result: 0b10000000, c: 1, z: 0 });
  expect(rotateRight(byte(0b01111111))).toEqual({ result: 0b10111111, c: 1, z: 0 });
  expect(rotateRight(byte(0b11111110))).toEqual({ result: 0b01111111, c: 0, z: 0 });
  expect(rotateRight(byte(0b10101010))).toEqual({ result: 0b01010101, c: 0, z: 0 });
  expect(rotateRight(byte(0b01010101))).toEqual({ result: 0b10101010, c: 1, z: 0 });

  expect(rotateRight(byte(0b00000000), 1)).toEqual({ result: 0b10000000, c: 0, z: 0 });
  expect(rotateRight(byte(0b11111111), 0)).toEqual({ result: 0b01111111, c: 1, z: 0 });
  expect(rotateRight(byte(0b10000000), 1)).toEqual({ result: 0b11000000, c: 0, z: 0 });
  expect(rotateRight(byte(0b00000001), 0)).toEqual({ result: 0b00000000, c: 1, z: 1 });
  expect(rotateRight(byte(0b01111111), 0)).toEqual({ result: 0b00111111, c: 1, z: 0 });
  expect(rotateRight(byte(0b11111110), 1)).toEqual({ result: 0b11111111, c: 0, z: 0 });
  expect(rotateRight(byte(0b10101010), 1)).toEqual({ result: 0b11010101, c: 0, z: 0 });
  expect(rotateRight(byte(0b01010101), 0)).toEqual({ result: 0b00101010, c: 1, z: 0 });
});

test('shiftLeftA', () => {
  expect(shiftLeftA(byte(0b00000000))).toEqual({ result: 0b00000000, c: 0, z: 1 });
  expect(shiftLeftA(byte(0b00000001))).toEqual({ result: 0b00000010, c: 0, z: 0 });
  expect(shiftLeftA(byte(0b10000000))).toEqual({ result: 0b00000000, c: 1, z: 1 });
});

test('shiftRightA', () => {
  expect(shiftRightA(byte(0b00000000))).toEqual({ result: 0b00000000, c: 0, z: 1 });
  expect(shiftRightA(byte(0b00000001))).toEqual({ result: 0b00000000, c: 0, z: 1 });
  expect(shiftRightA(byte(0b10000000))).toEqual({ result: 0b11000000, c: 0, z: 0 });
});

test('shiftRightL', () => {
  expect(shiftRightL(byte(0b00000000))).toEqual({ result: 0b00000000, c: 0, z: 1 });
  expect(shiftRightL(byte(0b00000001))).toEqual({ result: 0b00000000, c: 1, z: 1 });
  expect(shiftRightL(byte(0b10000000))).toEqual({ result: 0b01000000, c: 0, z: 0 });
});

test('swap', () => {
  expect(swap(byte(0b00000000))).toEqual({ result: 0b00000000, z: 1, c: 0 });
  expect(swap(byte(0b11111111))).toEqual({ result: 0b11111111, z: 0, c: 0 });
  expect(swap(byte(0b11110000))).toEqual({ result: 0b00001111, z: 0, c: 0 });
  expect(swap(byte(0b00111100))).toEqual({ result: 0b11000011, z: 0, c: 0 });
});

test('decimalAdjust', () => {
  let additions = [
    { a: 0x01, b: 0x02, expected: 0x03, overflow: 0 },
    { a: 0x10, b: 0x10, expected: 0x20, overflow: 0 },
    { a: 0x09, b: 0x01, expected: 0x10, overflow: 0 },
    { a: 0x09, b: 0x09, expected: 0x18, overflow: 0 },
    { a: 0x90, b: 0x90, expected: 0x80, overflow: 1 },
  ];

  for (let { a, b, expected, overflow } of additions) {
    let { result, h, c } = addBytes(byte(a), byte(b));
    expect(decimalAdjust(result, 0, h, c)).toEqual({ result: expected, overflow });
  }

  let subtractions = [
    { a: 0x10, b: 0x10, expected: 0x00, overflow: 0 },
    { a: 0x10, b: 0x01, expected: 0x09, overflow: 0 },
    { a: 0x01, b: 0x02, expected: 0x99, overflow: 1 },
    { a: 0x02, b: 0x01, expected: 0x01, overflow: 0 },
  ];

  for (let { a, b, expected, overflow } of subtractions) {
    let { result, h, c } = subtractBytes(byte(a), byte(b));
    expect(decimalAdjust(result, 1, h, c)).toEqual({ result: expected, overflow });
  }
});

test('addSignedOffset', () => {
  expect(addSignedOffset(word(0x0000), byte(0x00))).toEqual({ result: 0, z: 1, h: 0, c: 0 });
  expect(addSignedOffset(word(0x1000), byte(0xff))).toEqual({ result: 0x0fff, z: 0, h: 1, c: 0 });
  expect(addSignedOffset(word(0x0001), byte(0xfe))).toEqual({ result: 0xffff, z: 0, h: 1, c: 1 });
});

test('signedByte', () => {
  expect(signedByte(byte(0x00))).toBe(0);
  expect(signedByte(byte(0x01))).toBe(1);
  expect(signedByte(byte(0x7f))).toBe(127);
  expect(signedByte(byte(0x80))).toBe(-128);
  expect(signedByte(byte(0xff))).toBe(-1);
});

test('readWord', () => {
  let dataSource = buffer(new Uint8Array([0x00, 0x10, 0x11, 0x01]));

  expect(readWord(dataSource, 0)).toBe(0x1000);
  expect(readWord(dataSource, 1)).toBe(0x1110);
  expect(readWord(dataSource, 2)).toBe(0x0111);
});

test('writeWord', () => {
  let dataSource = buffer(3);

  writeWord(dataSource, 0, word(0x1101));
  expect(dataSource.buffer[0]).toBe(0x01);
  expect(dataSource.buffer[1]).toBe(0x11);
  expect(dataSource.buffer[2]).toBe(0x00);

  writeWord(dataSource, 1, word(0xdead));
  expect(dataSource.buffer[0]).toBe(0x01);
  expect(dataSource.buffer[1]).toBe(0xad);
  expect(dataSource.buffer[2]).toBe(0xde);
});
