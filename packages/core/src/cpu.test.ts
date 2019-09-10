import { Flags, Registers } from './cpu';

describe('CPU Flags', () => {
  test('z flag', () => {
    let flags = new Flags();

    expect(flags.value).toBe(0);
    expect(flags.z).toBe(0);

    flags.z = 1;

    expect(flags.value).toBe(128);
    expect(flags.z).toBe(1);

    flags.z = 0;

    expect(flags.value).toBe(0);
    expect(flags.z).toBe(0);

    flags.value = 0b10110000;

    expect(flags.z).toBe(1);

    flags.z = 0;

    expect(flags.value).toBe(0b00110000);
  });

  test('n flag', () => {
    let flags = new Flags();

    expect(flags.value).toBe(0);
    expect(flags.n).toBe(0);

    flags.n = 1;

    expect(flags.value).toBe(64);
    expect(flags.n).toBe(1);

    flags.n = 0;

    expect(flags.value).toBe(0);
    expect(flags.n).toBe(0);

    flags.value = 0b11010000;

    expect(flags.n).toBe(1);

    flags.n = 0;

    expect(flags.value).toBe(0b10010000);
  });

  test('h flag', () => {
    let flags = new Flags();

    expect(flags.value).toBe(0);
    expect(flags.h).toBe(0);

    flags.h = 1;

    expect(flags.value).toBe(32);
    expect(flags.h).toBe(1);

    flags.h = 0;

    expect(flags.value).toBe(0);
    expect(flags.h).toBe(0);

    flags.value = 0b10110000;

    expect(flags.h).toBe(1);

    flags.h = 0;

    expect(flags.value).toBe(0b10010000);
  });

  test('c flag', () => {
    let flags = new Flags();

    expect(flags.value).toBe(0);
    expect(flags.c).toBe(0);

    flags.c = 1;

    expect(flags.value).toBe(16);
    expect(flags.c).toBe(1);

    flags.c = 0;

    expect(flags.value).toBe(0);
    expect(flags.c).toBe(0);

    flags.value = 0b10110000;

    expect(flags.c).toBe(1);

    flags.c = 0;

    expect(flags.value).toBe(0b10100000);
  });
});

describe('CPU Registers', () => {
  test('b, c, bc registers', () => {
    let registers = new Registers();

    expect(registers.b).toBe(0);
    expect(registers.c).toBe(0);
    expect(registers.bc).toBe(0);

    registers.b = 0xa5;

    expect(registers.b).toBe(0xa5);
    expect(registers.c).toBe(0);
    expect(registers.bc).toBe(0xa500);

    registers.c = 0x9e;

    expect(registers.b).toBe(0xa5);
    expect(registers.c).toBe(0x9e);
    expect(registers.bc).toBe(0xa59e);

    registers.bc = 0xb388;

    expect(registers.b).toBe(0xb3);
    expect(registers.c).toBe(0x88);
    expect(registers.bc).toBe(0xb388);
  });

  test('d, e, de registers', () => {
    let registers = new Registers();

    expect(registers.d).toBe(0);
    expect(registers.e).toBe(0);
    expect(registers.de).toBe(0);

    registers.d = 0xa5;

    expect(registers.d).toBe(0xa5);
    expect(registers.e).toBe(0);
    expect(registers.de).toBe(0xa500);

    registers.e = 0x9e;

    expect(registers.d).toBe(0xa5);
    expect(registers.e).toBe(0x9e);
    expect(registers.de).toBe(0xa59e);

    registers.de = 0xb388;

    expect(registers.d).toBe(0xb3);
    expect(registers.e).toBe(0x88);
    expect(registers.de).toBe(0xb388);
  });

  test('h, l, hl registers', () => {
    let registers = new Registers();

    expect(registers.h).toBe(0);
    expect(registers.l).toBe(0);
    expect(registers.hl).toBe(0);

    registers.h = 0xa5;

    expect(registers.h).toBe(0xa5);
    expect(registers.l).toBe(0);
    expect(registers.hl).toBe(0xa500);

    registers.l = 0x9e;

    expect(registers.h).toBe(0xa5);
    expect(registers.l).toBe(0x9e);
    expect(registers.hl).toBe(0xa59e);

    registers.hl = 0xb388;

    expect(registers.h).toBe(0xb3);
    expect(registers.l).toBe(0x88);
    expect(registers.hl).toBe(0xb388);
  });

  test('a, af and flag registers', () => {
    let registers = new Registers();

    expect(registers.a).toBe(0);
    expect(registers.flags.value).toBe(0);
    expect(registers.af).toBe(0);

    registers.a = 0xa5;

    expect(registers.a).toBe(0xa5);
    expect(registers.flags.value).toBe(0);
    expect(registers.af).toBe(0xa500);

    registers.flags.value = 0x9e;

    expect(registers.a).toBe(0xa5);
    expect(registers.flags.value).toBe(0x9e);
    expect(registers.af).toBe(0xa59e);

    registers.af = 0xb388;

    expect(registers.a).toBe(0xb3);
    expect(registers.flags.value).toBe(0x88);
    expect(registers.af).toBe(0xb388);
  });
});
