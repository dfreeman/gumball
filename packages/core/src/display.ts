import { buffer, registers, guard } from './data-source';
import { FRAME_CYCLES, VBLANK_CYCLES, SCANLINE_CYCLES, HBLANK_CYCLES, RENDER_CYCLES, SCAN_OAM_CYCLES } from './timings';

export default class Display {
  private vramData = new Uint8Array(0x2000);
  private oamData = new Uint8Array(0x00a0);

  private frameClock = 0;

  /**
   * Display RAM situated at 0x8000, containing character data
   * from 0x8000-0x97ff and background data from 0x9800-0x9fff.
   *
   * Accessible in any STAT mode other than 3.
   */
  public readonly vram = guard(buffer(this.vramData), () => !this.enabled || this.mode < 3);

  /**
   * Object Attribute Memory, holding 40 4-byte entries describing
   * active sprites:
   *  - Byte 0: Y position minus 16
   *  - Byte 1: X position minus 8
   *  - Byte 2: sprite tile number
   *  - Byte 3: sprite attributes
   *
   * http://gbdev.gg8.se/files/docs/mirrors/pandocs.html#vramspriteattributetableoam
   *
   * Accessible in STAT mode 0 or 1.
   */
  public readonly oam = guard(buffer(this.oamData), () => !this.enabled || this.mode < 2);

  /**
   * Video I/O registers
   *
   * http://gbdev.gg8.se/files/docs/mirrors/pandocs.html#videodisplay
   */
  public readonly registers = registers([
    /** 0xff40: LDC control register (r/w) */
    { address: 0x00, name: 'lcdc' },

    /** 0xff41: LCD status register (r/w) */
    { address: 0x01, name: 'stat', writeMask: 0b01111000 },

    /** 0xff42: Scroll X (r/w) */
    { address: 0x02, name: 'scx' },

    /** 0xff43: Scroll Y (r/w) */
    { address: 0x03, name: 'scy' },

    /** 0xff44: LCD Y coordinate (r) */
    { address: 0x04, name: 'ly', writeMask: 0 },

    /** 0xff45: LCD Y compare (r/w) */
    { address: 0x05, name: 'lyc' },

    /** 0xff46: OAM DMA transfer and start address (w) */
    { address: 0x06, name: 'dma' },

    /** 0xff47: BG palette data (r/w) */
    { address: 0x07, name: 'bgp' },

    /** 0xff48: Object palette 0 data (r/w) */
    { address: 0x08, name: 'obp0' },

    /** 0xff49: Object palette 1 data (r/w) */
    { address: 0x09, name: 'obp1' },

    /** 0xff4a: Window Y position (r/w) */
    { address: 0x0a, name: 'wy' },

    /** 0xff4b: Window X position minus 7 (r/w) */
    { address: 0x0b, name: 'wx' },
  ]);

  private get enabled(): boolean {
    return Boolean(this.registers.lcdc & 0x80);
  }

  private get mode(): Mode {
    return this.registers.stat & 0x03;
  }

  private get vblankInterruptEnabled(): boolean {
    return Boolean(this.registers.stat & Interrupt.VBlank);
  }

  private get hblankInterruptEnabled(): boolean {
    return Boolean(this.registers.stat & Interrupt.HBlank);
  }

  private get oamScanInterruptEnabled(): boolean {
    return Boolean(this.registers.stat & Interrupt.OAM);
  }

  private get coincidenceInterruptEnabled(): boolean {
    return Boolean(this.registers.stat & Interrupt.Concidence);
  }
}

enum Mode {
  /**
   * Scanning OAM for coordinates of sprites that
   * overlap the current line.
   *
   * OAM inaccessible, VRAM accessible.
   */
  ScanOAM = 2,

  /**
   * Reading OAM and VRAM to actually generate
   * the picture for the screen.
   *
   * OAM and VRAM both inaccessible.
   */
  Render = 3,

  /**
   * In between rendering lines.
   *
   * OAM and VRAM both accessible.
   */
  HBlank = 0,

  /**
   * In between rendering frames.
   *
   * OAM and VRAM both accessible.
   */
  VBlank = 1,
}

/**
 * Bits 3-6 of the STAT register indicate whether
 * interrupts are desired for given display events.
 */
enum Interrupt {
  /** Triggered when LYC == LY (i.e. a given scanline is reached) */
  Concidence = 0b01000000,

  /** Triggered when ScanOAM mode has started */
  OAM = 0b00100000,

  /** Triggered when VBlank mode has started */
  VBlank = 0b00010000,

  /** Triggered when HBlank mode has started */
  HBlank = 0b00001000,
}
