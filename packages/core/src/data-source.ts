import { Byte } from './sized';

/**
 * The `DataSource` is the core compositional element of
 * this emulator, exposing two simple operations: reading
 * a byte at a given address, and writing a byte to a given
 * address.
 *
 * The exact semantics of those operations depend in the
 * backing implementation of a given data source.
 */
type DataSource = {
  /**
   * Read one byte from the given address.
   */
  readByte(address: number): Byte;

  /**
   * Write one byte to the given address.
   */
  writeByte(address: number, value: Byte): void;
};

export default DataSource;

/**
 * A data source that does nothing at all. Reads always
 * return `0`, and writes have no effect. Mainly useful
 * for stubbing unimplemented components.
 */
export function nil(): DataSource {
  return {
    readByte(): Byte {
      return 0;
    },

    writeByte(): void {
      // Do nothing
    },
  };
}

export type BufferDataSource = DataSource & { readonly buffer: Uint8Array };

/**
 * A data source that manages its data in an in-memory buffer,
 * optionally translating all addresses by a given offset.
 */
export function buffer(size: number): BufferDataSource;
export function buffer(buffer: Uint8Array): BufferDataSource;
export function buffer(sizeOrBuffer: number | Uint8Array): BufferDataSource {
  let buffer = typeof sizeOrBuffer === 'number' ? new Uint8Array(sizeOrBuffer) : sizeOrBuffer;
  return {
    buffer,

    readByte(address: number): Byte {
      return buffer[address] as Byte;
    },

    writeByte(address: number, value: Byte): void {
      buffer[address] = value;
    },
  };
}

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
  let data = new Uint8Array(Math.max(...registers.map(r => r.address)) + 1);
  let index = registers.reduce(
    (acc, register) => {
      acc[register.address] = register;
      return acc;
    },
    {} as Record<number, RegisterDefinition<string>>
  );

  let result = {
    readByte(address: number): Byte {
      return data[address] as Byte;
    },

    writeByte(address: number, value: Byte): void {
      let register = index[address];
      if (register && typeof register.writeMask === 'number') {
        data[address] = (value & register.writeMask) + (data[address] & ~register.writeMask);
      } else {
        data[address] = value;
      }
    },
  } as RegisterBankDataSource<K>;

  Object.defineProperties(
    result,
    registers.reduce(
      (acc, register) => {
        acc[register.name] = {
          get() {
            return data[register.address];
          },
          set(value: Byte) {
            data[register.address] = value;
          },
        };
        return acc;
      },
      {} as PropertyDescriptorMap
    )
  );

  return result;
}
