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
};

export type RegisterBankDataSource<K extends string> = DataSource & Record<K, Byte>;

/**
 * A data source that maps named registers to an address space,
 * allowing data to be read and written via either scheme
 * and optionally limiting which bits of a register may be written
 * through the numeric address space.
 */
export function registerBank<K extends string>(registers: Array<RegisterDefinition<K>>): RegisterBankDataSource<K> {
  let data = new Uint8Array(Math.max(...registers.map((r) => r.address)) + 1);
  let index = registers.reduce((acc, register) => {
    acc[register.address] = register;
    return acc;
  }, {} as Record<number, RegisterDefinition<string>>);

  let result = {
    readByte(address: number): Byte {
      return data[address] as Byte;
    },

    writeByte(address: number, value: Byte): void {
      let writeMask = index[address]?.writeMask;
      if (typeof writeMask === 'number') {
        data[address] = (value & writeMask) + (data[address] & ~writeMask);
      } else {
        data[address] = value;
      }
    },
  } as RegisterBankDataSource<K>;

  Object.defineProperties(
    result,
    registers.reduce((acc, register) => {
      acc[register.name] = {
        get() {
          return data[register.address];
        },
        set(value: Byte) {
          data[register.address] = value;
        },
      };
      return acc;
    }, {} as PropertyDescriptorMap),
  );

  return result;
}
