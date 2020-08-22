import { Byte } from '../utils/sized-numbers';
import { DataSource } from './index';

/**
 * A data source that manages its data in an in-memory buffer,
 * optionally translating all addresses by a given offset.
 */
export function buffer(size: number): BufferDataSource;
export function buffer(buffer: Uint8Array): BufferDataSource;
export function buffer(sizeOrBuffer: number | Uint8Array): BufferDataSource {
  return new BufferDataSource(typeof sizeOrBuffer === 'number' ? new Uint8Array(sizeOrBuffer) : sizeOrBuffer);
}

export class BufferDataSource implements DataSource {
  public constructor(public readonly buffer: Uint8Array) {}

  public readByte(address: number): Byte {
    return this.buffer[address] as Byte;
  }

  public writeByte(address: number, value: Byte): void {
    this.buffer[address] = value;
  }
}
