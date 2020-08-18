import DataSource from './data-source';
import { Byte } from './sized';

export type AddressMapping = {
  /** The location of this data source in the presented memory. */
  offset: number;

  /** The size in bytes of the window in presented memory mapping to this data source. */
  length: number;

  /** The data source to present in this window of memory. */
  data: DataSource;
};

/**
 * An address bus presents a single unified address space
 * composed of multiple individual data sources. These sources
 * are specified on construction as a set of `AddressMapping`s,
 * and are subsequently addressible collectively.
 */
export default class AddressBus implements DataSource {
  private lookup: Array<AddressMapping | undefined>;

  public constructor(mappings: Array<AddressMapping>) {
    this.lookup = Array(Math.max(...mappings.map((m) => m.offset + m.length)));

    for (let mapping of mappings) {
      for (let i = mapping.offset, end = mapping.offset + mapping.length; i < end; i++) {
        if (this.lookup[i]) {
          throw new Error(`Address mapping overlap at 0x${i.toString(16)}`);
        }
        this.lookup[i] = mapping;
      }
    }
  }

  public readByte(address: number): Byte {
    let { data, offset } = this.findMapping(address);
    return data.readByte(address - offset);
  }

  public writeByte(address: number, value: Byte): void {
    let { data, offset } = this.findMapping(address);
    data.writeByte(address - offset, value);
  }

  /**
   * Locates the data source and associated metadata resident
   * at the given address.
   */
  private findMapping(address: number): AddressMapping {
    let mapping = this.lookup[address];
    if (!mapping) {
      throw new Error(`Access of unmapped address 0x${address.toString(16)}`);
    }
    return mapping;
  }
}
