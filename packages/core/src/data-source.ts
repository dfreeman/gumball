import { Byte } from '#src/utils/sized-numbers';

export { nil } from '#src/data-sources/nil';
export { guarded } from '#src/data-sources/guarded';
export { buffer } from '#src/data-sources/buffer';
export { registerBank } from '#src/data-sources/register-bank';
export { addressBus } from '#src/data-sources/address-bus';

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
