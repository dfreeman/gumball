import { byte, Byte } from '../utils/sized-numbers.js';
import DataSource from '../data-source/index.js';
import { buffer } from '../data-source/buffer.js';
import { nil } from '../data-source/nil.js';

const ADDR_LOGO = 0x0104;
const ADDR_TITLE = 0x0134;
const ADDR_MANUFACTURER_CODE = 0x013f;
const ADDR_CGB_FLAG = 0x0143;
const ADDR_SGB_FLAG = 0x0146;
const ADDR_CARTRIDGE_TYPE = 0x0147;
const ADDR_HEADER_CHECKSUM = 0x014d;
const ADDR_GLOBAL_CHECKSUM = 0x014e;

type DMGCartridgeInfo = {
  cgbSupport: CGBSupport.None;
};

type CGBCartridgeInfo = {
  cgbSupport: CGBSupport.Supported | CGBSupport.Required;
  gameId: string;
};

type BaseCartridgeInfo = {
  sgbSupport: SGBSupport;
  mbcType: MBCType;
  title: string;
  headerChecksum: number;
  globalChecksum: number;
  hasBattery: boolean;
};

type CartridgeInfo = BaseCartridgeInfo & (DMGCartridgeInfo | CGBCartridgeInfo);

// prettier-ignore
export const NINTENDO_LOGO = new Uint8Array([
  0xce, 0xed, 0x66, 0x66, 0xcc, 0x0d, 0x00, 0x0b, 0x03, 0x73, 0x00, 0x83, 0x00, 0x0c, 0x00, 0x0d,
  0x00, 0x08, 0x11, 0x1f, 0x88, 0x89, 0x00, 0x0e, 0xdc, 0xcc, 0x6e, 0xe6, 0xdd, 0xdd, 0xd9, 0x99,
  0xbb, 0xbb, 0x67, 0x63, 0x6e, 0x0e, 0xec, 0xcc, 0xdd, 0xdc, 0x99, 0x9f, 0xbb, 0xb9, 0x33, 0x3e,
]);

export default class Cartridge {
  public readonly rom0: DataSource;
  public readonly romX: DataSource;
  public readonly ram: DataSource;
  public readonly info: CartridgeInfo;

  private readonly data: Readonly<Uint8Array>;

  public constructor(data: Readonly<Uint8Array>) {
    this.data = data;
    this.info = this.buildInfo(data);

    let mbc = buildMBC(this.info.mbcType, data);

    this.rom0 = mbc.rom0;
    this.romX = mbc.romX;
    this.ram = mbc.ram;
  }

  private buildInfo(data: Readonly<Uint8Array>): CartridgeInfo {
    let mbcType: MBCType = data[ADDR_CARTRIDGE_TYPE];
    let cgbFlag = data[ADDR_CGB_FLAG];
    let cgbSupport =
      CGBSupport[cgbFlag & CGBSupport.Required ? 'Required' : cgbFlag & CGBSupport.Supported ? 'Supported' : 'None'];

    let info: BaseCartridgeInfo = {
      mbcType,
      sgbSupport: SGBSupport[data[ADDR_SGB_FLAG] & SGBSupport.Supported ? 'Supported' : 'None'],
      title: asciiString(data.subarray(ADDR_TITLE, ADDR_TITLE + 16)),
      headerChecksum: data[ADDR_HEADER_CHECKSUM],
      globalChecksum: (data[ADDR_GLOBAL_CHECKSUM] << 8) + data[ADDR_GLOBAL_CHECKSUM + 1],
      hasBattery: BATTERY_MBCS.includes(mbcType),
    };

    if (cgbSupport === CGBSupport.None) {
      return { ...info, cgbSupport };
    } else {
      let gameId = asciiString(data.subarray(ADDR_MANUFACTURER_CODE, ADDR_MANUFACTURER_CODE + 4));
      let title = info.title.slice(0, 11);
      return { ...info, cgbSupport, gameId, title };
    }
  }

  public hasValidHeader(): boolean {
    let checksum: Byte = 0;
    for (let i = ADDR_TITLE; i < ADDR_HEADER_CHECKSUM; i++) {
      checksum = byte(checksum - this.data[i] - 1);
    }

    if (checksum !== this.info.headerChecksum) {
      return false;
    }

    for (let i = 0, len = NINTENDO_LOGO.length; i < len; i++) {
      if (this.data[ADDR_LOGO + i] !== NINTENDO_LOGO[i]) {
        return false;
      }
    }

    return true;
  }
}

function asciiString(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => (byte ? String.fromCharCode(byte) : '')).join('');
}

export enum SGBSupport {
  None = 0x00,
  Supported = 0x03,
}

export enum CGBSupport {
  None = 0x00,
  Supported = 0x80,
  Required = 0xc0,
}

export enum MBCType {
  ROM = 0x00,
  MBC1 = 0x01,
  MBC1_RAM = 0x02,
  MBC1_RAM_BATTERY = 0x03,
  MBC2 = 0x05,
  MBC2_BATTERY = 0x06,
  ROM_RAM = 0x08,
  ROM_RAM_BATTERY = 0x09,
  MMM01 = 0x0b,
  MMM01_RAM = 0x0c,
  MMM01_RAM_BATTERY = 0x0d,
  MBC3_TIMER_BATTERY = 0x0f,
  MBC3_TIMER_RAM_BATTERY = 0x10,
  MBC3 = 0x11,
  MBC3_RAM = 0x12,
  MBC3_RAM_BATTERY = 0x13,
  MBC5 = 0x19,
  MBC5_RAM = 0x1a,
  MBC5_RAM_BATTERY = 0x1b,
  MBC5_RUMBLE = 0x1c,
  MBC5_RUMBLE_RAM = 0x1d,
  MBC5_RUMBLE_RAM_BATTERY = 0x1e,
  MBC6 = 0x20,
  MBC7_SENSOR_RUMBLE_RAM_BATTERY = 0x22,
  POCKET_CAMERA = 0xfc,
  BANDAI_TAMA5 = 0xfd,
  HUC3 = 0xfe,
  HUC1_RAM_BATTERY = 0xff,
}

const BATTERY_MBCS: ReadonlyArray<MBCType> = [
  MBCType.MBC1_RAM_BATTERY,
  MBCType.MBC2_BATTERY,
  MBCType.ROM_RAM_BATTERY,
  MBCType.MMM01_RAM_BATTERY,
  MBCType.MBC3_TIMER_BATTERY,
  MBCType.MBC3_TIMER_RAM_BATTERY,
  MBCType.MBC3_RAM_BATTERY,
  MBCType.MBC5_RAM_BATTERY,
  MBCType.MBC5_RUMBLE_RAM_BATTERY,
  MBCType.MBC7_SENSOR_RUMBLE_RAM_BATTERY,
  MBCType.HUC1_RAM_BATTERY,
];

type MBC = {
  rom0: DataSource;
  romX: DataSource;
  ram: DataSource;
};

function buildMBC(cartType: MBCType, data: Readonly<Uint8Array>): MBC {
  switch (cartType) {
    case MBCType.ROM:
    case MBCType.ROM_RAM:
    case MBCType.ROM_RAM_BATTERY:
      return {
        rom0: buffer(data.subarray(0x0000, 0x4000)),
        romX: buffer(data.subarray(0x4000, 0x8000)),
        ram: cartType === MBCType.ROM ? nil() : buffer(0x2000),
      };

    default:
      throw new Error(`Unsupported MBC type ${MBCType[cartType] ?? `<unknown: 0x${cartType.toString(16)}>`}`);
  }
}
