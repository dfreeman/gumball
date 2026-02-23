import { registerBank } from '#src/data-sources/register-bank';
import { buffer } from '#src/data-sources/buffer';
import { guarded } from '#src/data-sources/guarded';
import { byte, bit } from '#src/utils/sized-numbers';
import { label, flag, value, palette, tables, atom } from '#src/utils/debug';

/**
 * The Picture Processing Unit acts as the interface between
 * the LCD and the rest of the system.
 */
export default class PPU {
  public readonly ram = guarded(buffer(0x2000));
  public readonly oam = guarded(buffer(0x009f));
  public readonly registers = registerBank([
    // https://gbdev.io/pandocs/#ff40-lcd-control-register
    { address: 0x00, name: 'lcdc' },

    // https://gbdev.io/pandocs/#lcd-status-register
    { address: 0x01, name: 'stat', writeMask: 0b01111000 },

    // https://gbdev.io/pandocs/#lcd-position-and-scrolling
    { address: 0x02, name: 'scy' },
    { address: 0x03, name: 'scx' },
    { address: 0x04, name: 'ly', writeMask: 0 },
    { address: 0x05, name: 'lyc' },
    { address: 0x0a, name: 'wy' },
    { address: 0x0b, name: 'wx' },

    // https://gbdev.io/pandocs/#lcd-monochrome-palettes
    { address: 0x07, name: 'bgp' },
    { address: 0x08, name: 'obp0' },
    { address: 0x09, name: 'obp1' },

    // https://gbdev.io/pandocs/#lcd-oam-dma-transfers
    { address: 0x06, name: 'dma' },
  ]);

  private frameClocks = 0;
  private lineClocks = 0;
  private mode = PPUMode.OAMSearch;

  public constructor() {
    // Ensure memory locks and mode calculations start in the correct state.
    this.step(0);
  }

  public step(clocks: number): void {
    let registers = this.registers.values;
    let lineIncrement = Math.floor((this.lineClocks + clocks) / LINE_DURATION);

    this.frameClocks = (this.frameClocks + clocks) % FRAME_DURATION;
    this.lineClocks = (this.lineClocks + clocks) % LINE_DURATION;
    this.mode = this.computeMode();

    if (lineIncrement) {
      registers.ly = byte((registers.ly + lineIncrement) % TOTAL_LINES);
    }

    registers.stat = byte(
      (registers.stat & 0b01111000) | (bit(registers.lyc === registers.ly) << 2) | (this.mode & 0b00000011),
    );

    if (this.mode === PPUMode.Drawing || this.mode === PPUMode.OAMSearch) {
      this.oam.lock(0xff);
    } else {
      this.oam.unlock();
    }

    if (this.mode === PPUMode.Drawing) {
      this.ram.lock(0xff);
    } else {
      this.ram.unlock();
    }
  }

  public inspect(): string {
    let { lcdc, stat, scy, scx, ly, lyc, wy, wx, bgp, obp0, obp1, dma } = this.registers.values;

    return tables({
      'PPU Registers': [
        [label.byte('scx'), value(scx), label.byte('scy'), value(scy)],
        [label.byte('wx'), value(wx), label.byte('wy'), value(wy)],
        [label.byte('ly'), value(ly), label.byte('lyc'), value(lyc)],
        [label.byte('obp0'), palette(obp0, 3), label.byte('obp1'), palette(obp1, 3)],
        [label.byte('bgp'), palette(bgp, 4), label.byte('dma'), value(dma * 0x100, 4)],
      ],
      LCDC: [
        [label.bit('LCD'), flag(lcdc, 7)],
        [label.bit('Window Tile Map'), flag(lcdc, 6, '0x9c00', '0x9800')],
        [label.bit('Window Display'), flag(lcdc, 5)],
        [label.bit('BG & Window Tile Data'), flag(lcdc, 4, '0x8800', '0x8000')],
        [label.bit('BG Tile Map Display'), flag(lcdc, 3, '0x9c00', '0x9800')],
        [label.bit('Sprite Size'), flag(lcdc, 2, '8x16', '8x8')],
        [label.bit('Sprite Display'), flag(lcdc, 1)],
        [label.bit('BG/Window Display'), flag(lcdc, 0)],
      ],
      STAT: [
        [label.bit('Mode'), atom(PPUMode[this.mode])],
        [label.bit('LYC=LY Interrupt'), flag(stat, 6)],
        [label.bit('OAMSearch Interrupt'), flag(stat, 5)],
        [label.bit('VBlank Interrupt'), flag(stat, 4)],
        [label.bit('HBlank Interrupt'), flag(stat, 3)],
        [label.bit('Coincidence bit'), flag(stat, 2, 'LYC == LY', 'LYC != LY')],
      ],
    });
  }

  private computeMode(): PPUMode {
    let { frameClocks, lineClocks } = this;
    if (frameClocks >= LINE_DURATION * VISIBLE_LINES) {
      return PPUMode.VBlank;
    }

    if (lineClocks < DRAWING_START) {
      return PPUMode.OAMSearch;
    } else if (lineClocks < HBLANK_START) {
      return PPUMode.Drawing;
    } else {
      return PPUMode.HBlank;
    }
  }
}

export const DRAWING_START = 80;
export const HBLANK_START = 252;

export const VISIBLE_LINES = 144;
export const TOTAL_LINES = 154;

export const LINE_DURATION = 456;
export const FRAME_DURATION = LINE_DURATION * TOTAL_LINES;

// https://gbdev.io/pandocs/#ff41-stat-lcdc-status-r-w
// https://gbdev.io/pandocs/#pixel-fifo
// Note that 1 'dot' below corresponds to one 'clock tick'
// on the DMG (or 1/4 of a cycle), but would be 2 clocks
// on CGB in double-speed mode.
export enum PPUMode {
  /**
   * Horizontal blanking.
   *
   * Lasts 85 to 208 dots, i.e. 376 - however long mode 3 took.
   * During that time both OAM and VRAM are available to the CPU.
   */
  HBlank = 0,

  /**
   * Vertical blanking.
   *
   * Lasts 4560 dots, during which both OAM and VRAM are available
   * to the CPU.
   */
  VBlank = 1,

  /**
   * Scanning OAM for (X, Y) coordinates of sprites that overlap this line.
   *
   * Lasts 80 dots, during which VRAM is available but OAM is not.
   */
  OAMSearch = 2,

  /**
   * Reading OAM and VRAM to generate the picture.
   *
   * Lasts 168 to 291 dots, depending on number of sprites being drawn.
   * During that time, neither OAM nor VRAM is available to the CPU.
   *
   * Three things are known to contribute to extending the duration of mode 3:
   *  - If SCX % 8 is not 0 at the beginning of a scanline, rendering is paused
   *    for that many dots while pixels from the leftmost tile are discarded.
   *  - An active window causes a pause of at least 6 dots
   *  - Each sprite usually causes a pause of `11 - min(5, (x + SCX) % 8)` dots
   *
   * Currently the PPU makes no attempt to emulate this timing, and if that
   * ever changes much more information will need to be gleaned from pandocs
   * and elsewhere.
   */
  Drawing = 3,
}
