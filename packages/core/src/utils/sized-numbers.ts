declare const Unique: unique symbol;
export type Unique<T, Tag> = T & { [Unique]: Tag };

// These utilities help prevent silly, hard-to-track-down
// mistakes like reading one byte as an opcode operand
// when it expects only a word.

/**
 * A JS number certified to be 0 or 1;
 */
export type Bit = Unique<number, 'bit'> | 0 | 1;

/**
 * A JS number certified to represent a byte.
 */
export type Byte = Unique<number, 'byte'> | 0 | 1 | 0xff;

/**
 * A JS number certified to represent a 16-bit word.
 */
export type Word = Unique<number, 'word'> | 0 | 1 | 0xffff;

export function bit(value: number | boolean): Bit {
  return (Number(Boolean(value)) & 0x1) as Bit;
}

/**
 * Shortens the given number to one byte.
 */
export function byte(value: number): Byte {
  return (value & 0xff) as Byte;
}

/**
 * Shortens the given number to two bytes.
 */
export function word(value: number): Word {
  return (value & 0xffff) as Word;
}
