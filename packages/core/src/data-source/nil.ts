import { Byte } from '../utils/sized-numbers';
import { DataSource } from './index';

/**
 * A data source that does nothing at all. Reads always
 * return `0`, and writes have no effect. Mainly useful
 * for stubbing unimplemented components.
 */
export function nil(): DataSource {
  return new NilDataSource();
}

export class NilDataSource implements DataSource {
  public readByte(): Byte {
    return 0;
  }

  public writeByte(): void {
    // Do nothing
  }
}
