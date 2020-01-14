import { nil } from './data-source';

export default class Cartridge {
  /** Bank 0 of program data */
  public readonly rom0 = nil();

  /** Bank 1-n of program data */
  public readonly romx = nil();

  /** External expansion working RAM */
  public readonly xram = nil();

  constructor(private data: Uint8Array) {}
}
