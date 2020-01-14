import DataSource, { nil, buffer } from './data-source';
import AddressBus from './address-bus';
import CPU from './cpu';
import Cartridge from './cartridge';
import Display from './display';
import { Byte } from './sized';

export default class Emulator {
  private readonly cartridge: Cartridge;
  private readonly cpu: CPU;

  private readonly display = new Display();

  /** On-device working RAM */
  private readonly wram = buffer(0x2000);

  /** High-speed RAM used primarily for stack data */
  private readonly hram = buffer(0x007e);

  private inBootloader = true;

  public constructor(cartridge: Cartridge) {
    this.cartridge = cartridge;
    this.display = new Display();
    this.cpu = new CPU(
      new AddressBus([
        { offset: 0x0000, length: 0x4000, data: this.bootloader(this.cartridge.rom0) },
        { offset: 0x4000, length: 0x4000, data: this.cartridge.romx },
        { offset: 0x8000, length: 0x2000, data: this.display.vram },
        { offset: 0xa000, length: 0x2000, data: this.cartridge.xram },
        { offset: 0xc000, length: 0x2000, data: this.wram },
        { offset: 0xe000, length: 0x1e00, data: this.wram },
        { offset: 0xfe00, length: 0x00a0, data: this.display.oam },
        { offset: 0xfea0, length: 0x0060, data: nil() }, // dead zone
        { offset: 0xff00, length: 0x0040, data: nil() }, // TODO: audio registers
        { offset: 0xff40, length: 0x0040, data: this.display.registers },
        { offset: 0xff80, length: 0x007e, data: this.hram },
        { offset: 0xffff, length: 0x0001, data: nil() }, // TODO: interrupt enable register
      ])
    );
  }

  // TODO: not void? frame data?
  public stepFrame(): void {

  }

  private bootloader(data: DataSource): DataSource {
    return {
      readByte: (address) => {
        if (this.inBootloader && address < 0x100) {
          return BOOTLOADER[address] as Byte;
        } else {
          return data.readByte(address);
        }
      },

      writeByte: (address, value) => {
        if (!this.inBootloader || address >= 0x100) {
          data.writeByte(address, value);
        }
      },
    };
  }
}

const BOOTLOADER = new Uint8Array([/* TODO */]);
