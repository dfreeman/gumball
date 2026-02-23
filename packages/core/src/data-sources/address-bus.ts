import DataSource from '#src/data-source';
import { Byte } from '#src/utils/sized-numbers';

export type AddressMapping = {
  /** The location of this data source in the presented memory. */
  offset: number;

  /** The size in bytes of the window in presented memory mapping to this data source. */
  length: number;

  /** The data source to present in this window of memory. */
  data: DataSource;
};

/** Creates an address bus with the given mappings */
export function addressBus(mappings: Array<AddressMapping>): AddressBus {
  return new AddressBus(mappings);
}

/**
 * An address bus presents a single unified address space
 * composed of multiple individual data sources. These sources
 * are specified on construction as a set of `AddressMapping`s,
 * and are subsequently addressible collectively.
 */
export class AddressBus implements DataSource {
  private lookup: Array<AddressMapping | undefined>;
  private unmappedAddressHandler?: (address: number) => void;

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

  public onUnmappedAddress(handler: (address: number) => void): void {
    this.unmappedAddressHandler = handler;
  }

  public readByte(address: number): Byte {
    let mapping = this.findMapping(address);
    if (!mapping) return 0;

    return mapping.data.readByte(address - mapping.offset);
  }

  public writeByte(address: number, value: Byte): void {
    let mapping = this.findMapping(address);
    if (!mapping) return;

    mapping.data.writeByte(address - mapping.offset, value);
  }

  /**
   * Locates the data source and associated metadata resident
   * at the given address.
   */
  private findMapping(address: number): AddressMapping | undefined {
    let mapping = this.lookup[address];
    if (!mapping) {
      this.unmappedAddressHandler?.(address);
    }
    return mapping;
  }
}
