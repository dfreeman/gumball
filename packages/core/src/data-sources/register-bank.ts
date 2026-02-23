import { Byte } from '#src/utils/sized-numbers';
import { DataSource } from '#src/data-source';

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
  definitions: ReadonlyArray<RegisterDefinition<K>>,
): RegisterBankDataSource<K> {
  return new RegisterBankDataSource(definitions);
}

export class RegisterBankDataSource<K extends string> implements DataSource {
  private readonly index: Array<RegisterDefinition<K>>;
  public readonly values: Record<K, Byte>;

  public constructor(definitions: ReadonlyArray<RegisterDefinition<K>>) {
    this.values = Object.create(null);
    this.index = Array(Math.max(...definitions.map((r) => r.address)) + 1);

    for (let definition of definitions) {
      this.values[definition.name] = 0;
      this.index[definition.address] = definition;
    }
  }

  public readByte(address: number): Byte {
    let register = this.index[address];
    if (!register) return 0;

    let read = this.index[address]?.read;
    let value = this.values[register.name];
    if (typeof read === 'function') {
      value = read(value);
    }

    return value;
  }

  public writeByte(address: number, value: Byte): void {
    let register = this.index[address];
    if (!register) return;

    let { values: registers } = this;
    let { write, writeMask, name } = register;
    if (typeof write === 'function') {
      registers[name] = write(value);
      return;
    }

    if (typeof writeMask === 'number') {
      registers[name] = ((value & writeMask) + (registers[name] & ~writeMask)) as Byte;
      return;
    }

    registers[name] = value;
  }
}
