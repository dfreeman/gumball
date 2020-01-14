// These values are all from The PDF and Pandocs
// https://ia601906.us.archive.org/19/items/GameBoyProgManVer1.1/GameBoyProgManVer1.1.pdf
// https://gbdev.gg8.se/files/docs/mirrors/pandocs.html#lcdstatusregister

// Base speed of the Game Boy CPU
export const CPU_CYCLES_PER_SECOND = 4_194_304;

// Total horizontal rows on the LCD
export const LCD_SCANLINES = 144;

//
export const SCANLINE_CYCLES = 456;

// These three values together constitute the time spent on a scanline.
// Based on The Ultimate Game Boy Talk, they actually vary depending on
// what work the PPU is doing, but we're going to go with this as an ok
// approximation for now.
export const SCAN_OAM_CYCLES = 80;
export const RENDER_CYCLES = 172;
export const HBLANK_CYCLES = SCANLINE_CYCLES - SCAN_OAM_CYCLES - RENDER_CYCLES;

// 10 scanlines worth of time is spent in vblank mode between each frame
export const VBLANK_CYCLES = 10 * SCANLINE_CYCLES;

export const FRAME_CYCLES = SCANLINE_CYCLES * LCD_SCANLINES + VBLANK_CYCLES;
