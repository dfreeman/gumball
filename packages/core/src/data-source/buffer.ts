import { Byte } from '../utils/sized-numbers';
import { DataSource } from './index';

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
