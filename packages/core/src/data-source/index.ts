import { Byte } from '../utils/sized-numbers';

export { nil } from './nil';
export { guarded } from './guarded';
export { buffer } from './buffer';
export { registerBank } from './register-bank';
export { addressBus } from './address-bus';

/**
 * The `DataSource` is the core compositional element of
 * this emulator, exposing two simple operations: reading
 * a byte at a given address, and writing a byte to a given
 * address.
 *
 * The exact semantics of those operations depend in the
 * backing implementation of a given data source.
 */
export type DataSource = {
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
