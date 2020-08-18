import { Byte } from '../utils/sized-numbers';
import { DataSource } from './index';
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
