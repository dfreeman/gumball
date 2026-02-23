import { describe, test, expect } from 'vitest';
import PPU, { PPUMode } from '#src/ppu';
import * as Constants from '#src/ppu';

describe('PPU', () => {
  describe('STAT', () => {
    test('mode bits', () => {
      let ppu = new PPU();

      // We start in OAMSearch
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.OAMSearch);

      // Step to the last moment of OAMSearch
      ppu.step(Constants.DRAWING_START - 1);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.OAMSearch);

      // Step from the end of OAMSearch to Drawing
      ppu.step(1);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.Drawing);

      // Step to the last moment of Drawing
      ppu.step(Constants.HBLANK_START - Constants.DRAWING_START - 1);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.Drawing);

      // Step from the end of Drawing to HBlank
      ppu.step(1);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.HBlank);

      // Step to the last moment of HBlank
      ppu.step(Constants.LINE_DURATION - Constants.HBLANK_START - 1);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.HBlank);

      // Step from the end of HBlank and come around to OAMSearch for the next scanline
      ppu.step(1);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.OAMSearch);

      // Step through the last moment of HBlank on the last visible scanline
      ppu.step(Constants.LINE_DURATION * (Constants.VISIBLE_LINES - 1) - 1);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.HBlank);

      // Step ino VBlank
      ppu.step(1);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.VBlank);

      // Step through the 10 offscreen scanlines of VBlank
      ppu.step(Constants.LINE_DURATION * (Constants.TOTAL_LINES - Constants.VISIBLE_LINES) - 1);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.VBlank);

      // Come all the way around to OAMSearch for the first scanline of the next frame
      ppu.step(1);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.OAMSearch);
    });

    test('coincidence bit', () => {
      let ppu = new PPU();

      // LY and LYC both start at 0, so they coincide
      expect(ppu.registers.values.stat & 0b0100).toBeTruthy();

      // Change LYC and verify the coincidence bit is cleared
      ppu.registers.values.lyc = 1;
      ppu.step(1);
      expect(ppu.registers.values.stat & 0b0100).toBeFalsy();

      // Proceed to the very end of line 0 and check the bit is still cleared
      ppu.step(Constants.LINE_DURATION - 2);
      expect(ppu.registers.values.stat & 0b0100).toBeFalsy();

      // Then step into line 1 and verify the coincidence bit is set again
      ppu.step(1);
      expect(ppu.registers.values.stat & 0b0100).toBeTruthy();
    });
  });

  describe('memory access', () => {
    test('during OAMSearch', () => {
      let ppu = new PPU();

      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.OAMSearch);

      // RAM is unlocked
      expect(ppu.ram.readByte(0)).toBe(0);
      ppu.ram.writeByte(0, 1);
      expect(ppu.ram.readByte(0)).toBe(1);

      // OAM is locked
      expect(ppu.oam.inner.readByte(0)).toBe(0);
      expect(ppu.oam.readByte(0)).toBe(0xff);
      ppu.oam.writeByte(0, 1);
      expect(ppu.oam.inner.readByte(0)).toBe(0);
      expect(ppu.oam.readByte(0)).toBe(0xff);
    });

    test('during Drawing', () => {
      let ppu = new PPU();

      ppu.step(Constants.DRAWING_START);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.Drawing);

      // RAM is locked
      expect(ppu.ram.inner.readByte(0)).toBe(0);
      expect(ppu.ram.readByte(0)).toBe(0xff);
      ppu.ram.writeByte(0, 1);
      expect(ppu.ram.inner.readByte(0)).toBe(0);
      expect(ppu.ram.readByte(0)).toBe(0xff);

      // OAM is locked
      expect(ppu.oam.inner.readByte(0)).toBe(0);
      expect(ppu.oam.readByte(0)).toBe(0xff);
      ppu.oam.writeByte(0, 1);
      expect(ppu.oam.inner.readByte(0)).toBe(0);
      expect(ppu.oam.readByte(0)).toBe(0xff);
    });

    test('during HBlank', () => {
      let ppu = new PPU();

      ppu.step(Constants.HBLANK_START);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.HBlank);

      // RAM is unlocked
      expect(ppu.ram.readByte(0)).toBe(0);
      ppu.ram.writeByte(0, 1);
      expect(ppu.ram.readByte(0)).toBe(1);

      // OAM is unlocked
      expect(ppu.oam.readByte(0)).toBe(0);
      ppu.oam.writeByte(0, 1);
      expect(ppu.oam.readByte(0)).toBe(1);
    });

    test('during VBlank', () => {
      let ppu = new PPU();

      ppu.step(Constants.LINE_DURATION * Constants.VISIBLE_LINES);
      expect(ppu.registers.values.stat & 0b11).toEqual(PPUMode.VBlank);

      // RAM is unlocked
      expect(ppu.ram.readByte(0)).toBe(0);
      ppu.ram.writeByte(0, 1);
      expect(ppu.ram.readByte(0)).toBe(1);

      // OAM is unlocked
      expect(ppu.oam.readByte(0)).toBe(0);
      ppu.oam.writeByte(0, 1);
      expect(ppu.oam.readByte(0)).toBe(1);
    });
  });
});
