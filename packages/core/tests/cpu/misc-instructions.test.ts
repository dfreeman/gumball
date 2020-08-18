import testInstruction from '../helpers/test-instruction';
import { byte, bit } from '../../src/sized';
import { decimalAdjust } from '../../src/utils';

testInstruction('DAA', {
  instruction: 0x27,
  duration: 4,
  effect: ({ a, flags }) => ({
    a: decimalAdjust(a, flags.n, flags.h, flags.c).result,
    flags: {
      z: bit(decimalAdjust(a, flags.n, flags.h, flags.c).result === 0),
      h: 0,
      c: decimalAdjust(a, flags.n, flags.h, flags.c).overflow,
    },
  }),
});

testInstruction('CPL', {
  instruction: 0x2f,
  duration: 4,
  effect: ({ a }) => ({
    a: byte(~a),
    flags: {
      n: 1,
      h: 1,
    },
  }),
});

testInstruction('SCF', {
  instruction: 0x37,
  duration: 4,
  effect: () => ({
    flags: {
      n: 0,
      h: 0,
      c: 1,
    },
  }),
});

testInstruction('CCF', {
  instruction: 0x3f,
  duration: 4,
  effect: ({ flags }) => ({
    flags: {
      n: 0,
      h: 0,
      c: bit(!flags.c),
    },
  }),
});

testInstruction('HALT', {
  instruction: 0x76,
  duration: 4,
  after(cpu) {
    expect(cpu.isHalted).toBe(true);
  },
});

// testInstruction('PREFIX', {
//   instruction: 0xcb,
//   duration: 4,
//   effect: () => ({}),
// });

testInstruction('DI', {
  instruction: 0xf3,
  duration: 4,
  before(cpu) {
    cpu['ime'] = true;
    expect(cpu.interruptsEnabled).toBe(true);
  },
  after(cpu) {
    expect(cpu.interruptsEnabled).toBe(false);
  },
});

testInstruction('EI', {
  instruction: 0xfb,
  duration: 4,
  before(cpu) {
    cpu['ime'] = false;
    expect(cpu.interruptsEnabled).toBe(false);
  },
  after(cpu) {
    expect(cpu.interruptsEnabled).toBe(true);
  },
});
