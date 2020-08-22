import { Byte } from '../utils/sized-numbers';
import { DataSource } from './index';

export type RegisterDefinition<Name extends string> = {
  /** The address of this register */
  address: number;

  /** The name of this register */
  name: Name;

  /**
   * An optional mask indicating which bits are writable when
   * accessed via the numeric address. By default, the full
   * register is writable.
   */
  writeMask?: number;

  /**
   * Transforms a value written via `writeByte` into the one
   * that will actually be persisted. Takes precedence over
   * `writeMask` if both are specified.
   */
  write?: (value: Byte) => Byte;

  /**
   * Transforms a value read via `readByte` into the one that
   * will actually be returned.
   */
  read?: (value: Byte) => Byte;
};

/**
 * A data source that maps named registers to an address space,
 * allowing data to be read and written via either scheme
 * and optionally limiting which bits of a register may be written
 * through the numeric address space.
 */
export function registerBank<K extends string>(
  registers: ReadonlyArray<RegisterDefinition<K>>,
): RegisterBankDataSource<K> {
  let data = new Uint8Array(Math.max(...registers.map((r) => r.address)) + 1);
  let result = new RegisterBank(data, registers) as RegisterBankDataSource<K>;

  Object.defineProperties(
    result,
    registers.reduce(
      (acc, register) => ({
        ...acc,
        [register.name]: {
          get: () => data[register.address],
          set: (value: Byte) => (data[register.address] = value),
        },
      }),
      {},
    ),
  );

  return result;
}

type RegisterBankDataSource<K extends string> = RegisterBank & Record<K, Byte>;

export class RegisterBank implements DataSource {
  private readonly data: Uint8Array;
  private readonly index: Record<number, RegisterDefinition<string>>;

  public constructor(data: Uint8Array, registers: ReadonlyArray<RegisterDefinition<string>>) {
    this.data = data;
    this.index = registers.reduce((acc, register) => ({ ...acc, [register.address]: register }), {});
  }

  public readByte(address: number): Byte {
    let read = this.index[address]?.read;
    let value = this.data[address] as Byte;
    if (typeof read === 'function') {
      value = read(value);
    }

    return value;
  }

  public writeByte(address: number, value: Byte): void {
    let { data } = this;
    let register = this.index[address];
    let write = register?.write;
    if (typeof write === 'function') {
      data[address] = write(value);
      return;
    }

    let writeMask = register?.writeMask;
    if (typeof writeMask === 'number') {
      data[address] = (value & writeMask) + (data[address] & ~writeMask);
      return;
    }

    data[address] = value;
  }
}
