import DataSource from '#src/data-source';
import CPU from '#src/cpu';
import Cartridge from '#src/cartridge';
import { Byte } from '#src/utils/sized-numbers';
import { nil } from '#src/data-sources/nil';
import { buffer } from '#src/data-sources/buffer';
import { addressBus } from '#src/data-sources/address-bus';
import PPU from '#src/ppu';

export default class DMG {
  private readonly cartridge: Cartridge;
  private readonly ppu: PPU;
  private readonly cpu: CPU;

  private breakpoints = new Set<number>();

  public constructor(rom: Uint8Array) {
    this.cartridge = new Cartridge(rom);
    this.ppu = new PPU();

    let cartridgeFixedROM = this.cartridge.rom0;
    let cartridgeBankedROM = this.cartridge.romX;
    let videoRAM = this.ppu.ram;
    let cartridgeRAM = this.cartridge.ram;
    let workingRAM = buffer(0x2000);
    let echoRAM = workingRAM;
    let oam = this.ppu.oam;
    let deadZone = nil();
    let ioRegisters = nil(); // TODO
    let ppuRegisters = this.ppu.registers;
    let highRAM = buffer(0x7e);
    let interruptEnabledRegister = nil(); // TODO

    this.cpu = new CPU(
      bootOverlay(
        addressBus([
          { offset: 0x0000, length: 0x4000, data: cartridgeFixedROM },
          { offset: 0x4000, length: 0x4000, data: cartridgeBankedROM },
          { offset: 0x8000, length: 0x2000, data: videoRAM },
          { offset: 0xa000, length: 0x2000, data: cartridgeRAM },
          { offset: 0xc000, length: 0x2000, data: workingRAM },
          { offset: 0xe000, length: 0x1dff, data: echoRAM },
          { offset: 0xfe00, length: 0x009f, data: oam },
          { offset: 0xfea0, length: 0x005f, data: deadZone },
          { offset: 0xff00, length: 0x002f, data: ioRegisters },
          { offset: 0xff40, length: 0x000f, data: ppuRegisters },
          { offset: 0xff80, length: 0x007e, data: highRAM },
          { offset: 0xffff, length: 0x0001, data: interruptEnabledRegister },
        ]),
      ),
    );
  }

  /**
   * Run the device for the given number of cycles, potentially going
   * slightly over if the last CPU instruction takes longer than the
   * remaining allotted time.
   */
  public step(window = 1): number {
    let { cpu, ppu } = this;
    let total = 0;

    while (total < window && cpu.isRunning) {
      // In principle, complex CPU instructions might actually take long enough
      // that the other devices should have the opportunity to update registers
      // themselves during that time, but the world is much easier if we treat
      // instructions as atomic. If too many things turn out to be sensitive to
      // that level of timing, we can always revisit.
      let duration = cpu.step();

      ppu.step(duration);

      total += duration;

      if (this.breakpoints.has(cpu.registers.pc)) {
        console.log(`Hit breakpoint at 0x${cpu.registers.pc.toString(16).padStart(4, '0')}`);
        break;
      }
    }

    return total;
  }
}

// const DMG_REGISTERS = [
//   // Joypad
//   // https://gbdev.io/pandocs/#joypad-input
//   { address: 0x00, name: 'p1', writeMask: 0b00110000 },

//   // Serial Transfer
//   // https://gbdev.io/pandocs/#serial-data-transfer
//   { address: 0x01, name: 'sb' },
//   { address: 0x02, name: 'sc' },

//   // Timer and Divider registers
//   // https://gbdev.io/pandocs/#timer-and-divider-registers
//   { address: 0x04, name: 'div', write: (): Byte => 0 },
//   { address: 0x05, name: 'tima' },
//   { address: 0x06, name: 'tma' },
//   { address: 0x07, name: 'tac' },

//   // Interrupt flag
//   // https://gbdev.io/pandocs/#interrupts
//   { address: 0x0f, name: 'if', writeMask: 0b0001111 },

//   // Sound Controller
//   // https://gbdev.io/pandocs/#sound-channel-1-tone-sweep
//   { address: 0x10, name: 'nr10' },
//   { address: 0x11, name: 'nr11' },
//   { address: 0x12, name: 'nr12' },
//   { address: 0x13, name: 'nr13', read: (): Byte => 0 },
//   { address: 0x14, name: 'nr14' },
//   // https://gbdev.io/pandocs/#sound-channel-2-tone
//   { address: 0x16, name: 'nr21' },
//   { address: 0x17, name: 'nr22' },
//   { address: 0x18, name: 'nr23', read: (): Byte => 0 },
//   { address: 0x19, name: 'nr24' },
//   // https://gbdev.io/pandocs/#sound-channel-3-wave-output
//   { address: 0x1a, name: 'nr30' },
//   { address: 0x1b, name: 'nr31' },
//   { address: 0x1c, name: 'nr32' },
//   { address: 0x1d, name: 'nr33', read: (): Byte => 0 },
//   { address: 0x1e, name: 'nr34' },
//   // https://gbdev.io/pandocs/#sound-channel-4-noise
//   { address: 0x20, name: 'nr41' },
//   { address: 0x21, name: 'nr42' },
//   { address: 0x22, name: 'nr43' },
//   { address: 0x23, name: 'nr44' },
//   // https://gbdev.io/pandocs/#sound-control-registers
//   { address: 0x24, name: 'nr50' },
//   { address: 0x25, name: 'nr51' },
//   { address: 0x26, name: 'nr52' },

//   // Wave pattern RAM: 0x30-0x3f
//   // https://gbdev.io/pandocs/#ff30-ff3f-wave-pattern-ram
// ] as const;

const ADDR_BOOT_END_REGISTER = 0xff50;

function bootOverlay(memory: DataSource): DataSource {
  return new BootOverlay(memory);
}

class BootOverlay implements DataSource {
  private booting = true;

  public constructor(private memory: DataSource) {}

  public readByte(address: number): Byte {
    if (this.booting && address < BOOT_ROM.length) {
      return BOOT_ROM[address] as Byte;
    }

    return this.memory.readByte(address);
  }

  public writeByte(address: number, value: Byte): void {
    if (this.booting) {
      if (address < BOOT_ROM.length) {
        return;
      } else if (address === ADDR_BOOT_END_REGISTER) {
        this.booting = false;
        return;
      }
    }

    this.memory.writeByte(address, value);
  }
}

// prettier-ignore
const BOOT_ROM = new Uint8Array([
  0x31, 0xfe, 0xff, 0xaf, 0x21, 0xff, 0x9f, 0x32,
  0xcb, 0x7c, 0x20, 0xfb, 0x21, 0x26, 0xff, 0x0e,
  0x11, 0x3e, 0x80, 0x32, 0xe2, 0x0c, 0x3e, 0xf3,
  0xe2, 0x32, 0x3e, 0x77, 0x77, 0x3e, 0xfc, 0xe0,
  0x47, 0x11, 0x04, 0x01, 0x21, 0x10, 0x80, 0x1a,
  0xcd, 0x95, 0x00, 0xcd, 0x96, 0x00, 0x13, 0x7b,
  0xfe, 0x34, 0x20, 0xf3, 0x11, 0xd8, 0x00, 0x06,
  0x08, 0x1a, 0x13, 0x22, 0x23, 0x05, 0x20, 0xf9,
  0x3e, 0x19, 0xea, 0x10, 0x99, 0x21, 0x2f, 0x99,
  0x0e, 0x0c, 0x3d, 0x28, 0x08, 0x32, 0x0d, 0x20,
  0xf9, 0x2e, 0x0f, 0x18, 0xf3, 0x67, 0x3e, 0x64,
  0x57, 0xe0, 0x42, 0x3e, 0x91, 0xe0, 0x40, 0x04,
  0x1e, 0x02, 0x0e, 0x0c, 0xf0, 0x44, 0xfe, 0x90,
  0x20, 0xfa, 0x0d, 0x20, 0xf7, 0x1d, 0x20, 0xf2,
  0x0e, 0x13, 0x24, 0x7c, 0x1e, 0x83, 0xfe, 0x62,
  0x28, 0x06, 0x1e, 0xc1, 0xfe, 0x64, 0x20, 0x06,
  0x7b, 0xe2, 0x0c, 0x3e, 0x87, 0xe2, 0xf0, 0x42,
  0x90, 0xe0, 0x42, 0x15, 0x20, 0xd2, 0x05, 0x20,
  0x4f, 0x16, 0x20, 0x18, 0xcb, 0x4f, 0x06, 0x04,
  0xc5, 0xcb, 0x11, 0x17, 0xc1, 0xcb, 0x11, 0x17,
  0x05, 0x20, 0xf5, 0x22, 0x23, 0x22, 0x23, 0xc9,
  0xce, 0xed, 0x66, 0x66, 0xcc, 0x0d, 0x00, 0x0b,
  0x03, 0x73, 0x00, 0x83, 0x00, 0x0c, 0x00, 0x0d,
  0x00, 0x08, 0x11, 0x1f, 0x88, 0x89, 0x00, 0x0e,
  0xdc, 0xcc, 0x6e, 0xe6, 0xdd, 0xdd, 0xd9, 0x99,
  0xbb, 0xbb, 0x67, 0x63, 0x6e, 0x0e, 0xec, 0xcc,
  0xdd, 0xdc, 0x99, 0x9f, 0xbb, 0xb9, 0x33, 0x3e,
  0x3c, 0x42, 0xb9, 0xa5, 0xb9, 0xa5, 0x42, 0x3c,
  0x21, 0x04, 0x01, 0x11, 0xa8, 0x00, 0x1a, 0x13,
  0xbe, 0x20, 0xfe, 0x23, 0x7d, 0xfe, 0x34, 0x20,
  0xf5, 0x06, 0x19, 0x78, 0x86, 0x23, 0x05, 0x20,
  0xfb, 0x86, 0x20, 0xfe, 0x3e, 0x01, 0xe0, 0x50,
]);
