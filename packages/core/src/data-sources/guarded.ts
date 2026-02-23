import DataSource from '#src/data-source';
import { Byte } from '#src/utils/sized-numbers';

/**
 * Wraps a given data source, making it unavailable when 'locked'
 */
export function guarded<T extends DataSource>(inner: T): Guarded<T> {
  return new Guarded(inner);
}

const UNLOCKED = -1 as const;

export class Guarded<T extends DataSource> implements DataSource {
  private lockValue: Byte | typeof UNLOCKED = UNLOCKED;

  public constructor(public readonly inner: T) {}

  public lock(value: Byte): void {
    this.lockValue = value;
  }

  public unlock(): void {
    this.lockValue = UNLOCKED;
  }

  public readByte(address: number): Byte {
    if (this.lockValue === UNLOCKED) {
      return this.inner.readByte(address);
    }

    return this.lockValue;
  }

  public writeByte(address: number, value: Byte): void {
    if (this.lockValue === UNLOCKED) {
      this.inner.writeByte(address, value);
    }
  }
}
