import { Bit, Word, Byte, byte, word, bit } from './sized';

export type ByteRegister = 'a' | 'b' | 'c' | 'd' | 'e' | 'h' | 'l';
export type WordRegister = 'af' | 'bc' | 'de' | 'hl' | 'sp' | 'pc';
export type Flag = 'z' | 'n' | 'h' | 'c';

/**
 * The current state of the CPU's on board registers.
 *
 * http://gbdev.gg8.se/wiki/articles/CPU_Registers_and_Flags
 */
export class Registers {
  public a = byte(0);
  public b = byte(0);
  public c = byte(0);
  public d = byte(0);
  public e = byte(0);
  public h = byte(0);
  public l = byte(0);

  /**
   * The currently set flags, which also function as the lower
   * half of the 16-bit `af` register.
   */
  public readonly f = new Flags();

  /**
   * The stack pointer.
   */
  public sp = word(0);

  /**
   * The program counter.
   */
  public pc = word(0);

  /**
   * Produces a copy of the current state of this registers
   * object, mainly useful for testing.
   */
  public clone(): Registers {
    let clone = new Registers();
    let { a, b, c, d, e, h, l, sp, pc } = this;

    Object.assign(clone, { a, b, c, d, e, h, l, sp, pc });
    clone.f.value = this.f.value;

    return clone;
  }

  /**
   * A 16-bit view of the `a` register and flags together.
   */
  public get af(): Word {
    return ((this.a << 8) + this.f.value) as Word;
  }

  public set af(value: Word) {
    this.a = ((value >> 8) & 0xff) as Byte;
    this.f.value = (value & 0xff) as Byte;
  }

  /**
   * A 16-bit view of the `b` and `c` registers together.
   */
  public get bc(): Word {
    return ((this.b << 8) + this.c) as Word;
  }

  public set bc(value: Word) {
    this.b = ((value >> 8) & 0xff) as Byte;
    this.c = (value & 0xff) as Byte;
  }

  /**
   * A 16-bit view of the `d` and `e` registers together.
   */
  public get de(): Word {
    return ((this.d << 8) + this.e) as Word;
  }

  public set de(value: Word) {
    this.d = ((value >> 8) & 0xff) as Byte;
    this.e = (value & 0xff) as Byte;
  }

  /**
   * A 16-bit view of the `h` and `l` registers together.
   */
  public get hl(): Word {
    return ((this.h << 8) + this.l) as Word;
  }

  public set hl(value: Word) {
    this.h = ((value >> 8) & 0xff) as Byte;
    this.l = (value & 0xff) as Byte;
  }
}

/**
 * The contents of the CPU `f` register
 *
 * http://gbdev.gg8.se/wiki/articles/CPU_Registers_and_Flags
 */
export class Flags {
  /**
   * The underlying byte value of the current flag state.
   *  - bit 7: `z`
   *  - bit 6: `n`
   *  - bit 5: `h`
   *  - bit 4: `c`
   *  - bits 3-0: always `0`
   */
  public value = byte(0);

  /**
   * The zero flag.
   *
   * Set when the result of an operation was 0.
   */
  public get z(): Bit {
    return getBit(this.value, 7);
  }

  public set z(bit: Bit) {
    this.value = setBit(this.value, 7, bit);
  }

  /**
   * The subtraction flag.
   *
   * Set when an operation was a subtraction.
   * Pretty much just useful for cleaning up the results
   * of performing arithmetic on BCD values.
   *
   * https://en.wikipedia.org/wiki/Binary-coded_decimal
   * https://rednex.github.io/rgbds/gbz80.7.html#DAA
   */
  public get n(): Bit {
    return getBit(this.value, 6);
  }

  public set n(bit: Bit) {
    this.value = setBit(this.value, 6, bit);
  }

  /**
   * The half-carry flag.
   *
   * Set when an operation results in a carry over
   * a nibble boundary. Also mostly only relevant for
   * cleanup after operations on BCD values.
   */
  public get h(): Bit {
    return getBit(this.value, 5);
  }

  public set h(bit: Bit) {
    this.value = setBit(this.value, 5, bit);
  }

  /**
   * The carry flag.
   *
   * Set when the result of an operation exceeds `0xff`
   * or `0xffff` for 8- and 16-bit operations respectively.
   * Also set when a subtraction or comparison results in
   * a value less than zero, or when a rotate operation
   * shifts out a 1 bit.
   */
  public get c(): Bit {
    return getBit(this.value, 4);
  }

  public set c(bit: Bit) {
    this.value = setBit(this.value, 4, bit);
  }
}

function getBit(value: Byte, index: number): Bit {
  return bit(value & (1 << index));
}

function setBit(value: Byte, index: number, on: Bit): Byte {
  if (on) {
    return byte(value | (1 << index));
  } else {
    return byte(value & ~(1 << index));
  }
}
