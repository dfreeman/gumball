export default class CPU {}

/**
 * The current state of the CPU's on board registers.
 *
 * http://gbdev.gg8.se/wiki/articles/CPU_Registers_and_Flags
 */
export class Registers {
  public a = 0;
  public b = 0;
  public c = 0;
  public d = 0;
  public e = 0;
  public h = 0;
  public l = 0;

  /**
   * The currently set flags, which also function as the lower
   * half of the 16-bit `af` register.
   */
  public flags = new Flags();

  /**
   * The stack pointer.
   */
  public sp = 0;

  /**
   * The program counter.
   */
  public pc = 0;

  /**
   * A 16-bit view of the `a` register and flags together.
   */
  public get af(): number {
    return (this.a << 8) + this.flags.value;
  }

  public set af(value: number) {
    this.a = (value >> 8) & 0xff;
    this.flags.value = value & 0xff;
  }

  /**
   * A 16-bit view of the `b` and `c` registers together.
   */
  public get bc(): number {
    return (this.b << 8) + this.c;
  }

  public set bc(value: number) {
    this.b = (value >> 8) & 0xff;
    this.c = value & 0xff;
  }

  /**
   * A 16-bit view of the `d` and `e` registers together.
   */
  public get de(): number {
    return (this.d << 8) + this.e;
  }

  public set de(value: number) {
    this.d = (value >> 8) & 0xff;
    this.e = value & 0xff;
  }

  /**
   * A 16-bit view of the `h` and `l` registers together.
   */
  public get hl(): number {
    return (this.h << 8) + this.l;
  }

  public set hl(value: number) {
    this.h = (value >> 8) & 0xff;
    this.l = value & 0xff;
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
  public value = 0;

  /**
   * The zero flag.
   *
   * Set when the result of an operation was 0.
   */
  public get z(): number {
    return getBit(this.value, 7);
  }

  public set z(bit: number) {
    this.value = setBit(this.value, 7, !!bit);
  }

  /**
   * The subtraction flag.
   *
   * Set when an operation was a subtraction.
   * Pretty much just useful for BCD.
   *
   * https://en.wikipedia.org/wiki/Binary-coded_decimal
   * https://rednex.github.io/rgbds/gbz80.7.html#DAA
   */
  public get n(): number {
    return getBit(this.value, 6);
  }

  public set n(bit: number) {
    this.value = setBit(this.value, 6, !!bit);
  }

  /**
   * The half-cary flag.
   *
   * Set when an operation results in a carry over
   * a nibble boundary. Also mostly relevant for BCD.
   */
  public get h(): number {
    return getBit(this.value, 5);
  }

  public set h(bit: number) {
    this.value = setBit(this.value, 5, !!bit);
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
  public get c(): number {
    return getBit(this.value, 4);
  }

  public set c(bit: number) {
    this.value = setBit(this.value, 4, !!bit);
  }
}

function getBit(value: number, index: number): number {
  return value & (1 << index) ? 1 : 0;
}

function setBit(value: number, index: number, on: boolean | number): number {
  if (on) {
    return value | (1 << index);
  } else {
    return value & ~(1 << index);
  }
}
