import DataSource from '.';
import { Byte } from '../utils/sized-numbers';

export type Guarded<T extends DataSource> = DataSource & { inner: T; lock(value: Byte): void; unlock(): void };

const UNLOCKED = -1 as const;

/**
 * Wraps a given data source, making it unavailable when 'locked'
 */
export function guarded<T extends DataSource>(inner: T): Guarded<T> {
  let lockValue: Byte | typeof UNLOCKED = UNLOCKED;

  return {
    inner,
    lock: (value = 0) => (lockValue = value),
    unlock: () => (lockValue = UNLOCKED),

    readByte(address) {
      if (lockValue === UNLOCKED) {
        return inner.readByte(address);
      }

      return lockValue;
    },

    writeByte(address, value) {
      if (lockValue === UNLOCKED) {
        inner.writeByte(address, value);
      }
    },
  };
}
