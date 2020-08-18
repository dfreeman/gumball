import testInstruction from '../../helpers/test-instruction';
import { addWords, addBytesCarry, addBytes, addSignedOffset } from '../../../src/utils/data';

testInstruction('ADD HL, BC', {
  instruction: 0x09,
  duration: 8,
  effect: ({ hl, bc }) => ({
    hl: addWords(hl, bc).result,
    flags: {
      n: 0,
      h: addWords(hl, bc).h,
      c: addWords(hl, bc).c,
    },
  }),
});

testInstruction('ADD HL, DE', {
  instruction: 0x19,
  duration: 8,
  effect: ({ hl, de }) => ({
    hl: addWords(hl, de).result,
    flags: {
      n: 0,
      h: addWords(hl, de).h,
      c: addWords(hl, de).c,
    },
  }),
});

testInstruction('ADD HL, HL', {
  instruction: 0x29,
  duration: 8,
  effect: ({ hl }) => ({
    hl: addWords(hl, hl).result,
    flags: {
      n: 0,
      h: addWords(hl, hl).h,
      c: addWords(hl, hl).c,
    },
  }),
});

testInstruction('ADD HL, SP', {
  instruction: 0x39,
  duration: 8,
  effect: ({ hl, sp }) => ({
    hl: addWords(hl, sp).result,
    flags: {
      n: 0,
      h: addWords(hl, sp).h,
      c: addWords(hl, sp).c,
    },
  }),
});

testInstruction('ADD A, B', {
  instruction: 0x80,
  duration: 4,
  effect: ({ a, b }) => ({
    a: addBytes(a, b).result,
    flags: {
      z: addBytes(a, b).z,
      n: 0,
      h: addBytes(a, b).h,
      c: addBytes(a, b).c,
    },
  }),
});

testInstruction('ADD A, C', {
  instruction: 0x81,
  duration: 4,
  effect: ({ a, c }) => ({
    a: addBytes(a, c).result,
    flags: {
      z: addBytes(a, c).z,
      n: 0,
      h: addBytes(a, c).h,
      c: addBytes(a, c).c,
    },
  }),
});

testInstruction('ADD A, D', {
  instruction: 0x82,
  duration: 4,
  effect: ({ a, d }) => ({
    a: addBytes(a, d).result,
    flags: {
      z: addBytes(a, d).z,
      n: 0,
      h: addBytes(a, d).h,
      c: addBytes(a, d).c,
    },
  }),
});

testInstruction('ADD A, E', {
  instruction: 0x83,
  duration: 4,
  effect: ({ a, e }) => ({
    a: addBytes(a, e).result,
    flags: {
      z: addBytes(a, e).z,
      n: 0,
      h: addBytes(a, e).h,
      c: addBytes(a, e).c,
    },
  }),
});

testInstruction('ADD A, H', {
  instruction: 0x84,
  duration: 4,
  effect: ({ a, h }) => ({
    a: addBytes(a, h).result,
    flags: {
      z: addBytes(a, h).z,
      n: 0,
      h: addBytes(a, h).h,
      c: addBytes(a, h).c,
    },
  }),
});

testInstruction('ADD A, L', {
  instruction: 0x85,
  duration: 4,
  effect: ({ a, l }) => ({
    a: addBytes(a, l).result,
    flags: {
      z: addBytes(a, l).z,
      n: 0,
      h: addBytes(a, l).h,
      c: addBytes(a, l).c,
    },
  }),
});

testInstruction('ADD A, (HL)', {
  instruction: 0x86,
  duration: 8,
  effect: ({ a, hl, memory }) => ({
    a: addBytes(a, memory[hl]).result,
    flags: {
      z: addBytes(a, memory[hl]).z,
      n: 0,
      h: addBytes(a, memory[hl]).h,
      c: addBytes(a, memory[hl]).c,
    },
  }),
});

testInstruction('ADD A, A', {
  instruction: 0x87,
  duration: 4,
  effect: ({ a }) => ({
    a: addBytes(a, a).result,
    flags: {
      z: addBytes(a, a).z,
      n: 0,
      h: addBytes(a, a).h,
      c: addBytes(a, a).c,
    },
  }),
});

testInstruction('ADC A, B', {
  instruction: 0x88,
  duration: 4,
  effect: ({ a, b, flags }) => ({
    a: addBytesCarry(a, b, flags.c).result,
    flags: {
      z: addBytesCarry(a, b, flags.c).z,
      n: 0,
      h: addBytesCarry(a, b, flags.c).h,
      c: addBytesCarry(a, b, flags.c).c,
    },
  }),
});

testInstruction('ADC A, C', {
  instruction: 0x89,
  duration: 4,
  effect: ({ a, c, flags }) => ({
    a: addBytesCarry(a, c, flags.c).result,
    flags: {
      z: addBytesCarry(a, c, flags.c).z,
      n: 0,
      h: addBytesCarry(a, c, flags.c).h,
      c: addBytesCarry(a, c, flags.c).c,
    },
  }),
});

testInstruction('ADC A, D', {
  instruction: 0x8a,
  duration: 4,
  effect: ({ a, d, flags }) => ({
    a: addBytesCarry(a, d, flags.c).result,
    flags: {
      z: addBytesCarry(a, d, flags.c).z,
      n: 0,
      h: addBytesCarry(a, d, flags.c).h,
      c: addBytesCarry(a, d, flags.c).c,
    },
  }),
});

testInstruction('ADC A, E', {
  instruction: 0x8b,
  duration: 4,
  effect: ({ a, e, flags }) => ({
    a: addBytesCarry(a, e, flags.c).result,
    flags: {
      z: addBytesCarry(a, e, flags.c).z,
      n: 0,
      h: addBytesCarry(a, e, flags.c).h,
      c: addBytesCarry(a, e, flags.c).c,
    },
  }),
});

testInstruction('ADC A, H', {
  instruction: 0x8c,
  duration: 4,
  effect: ({ a, h, flags }) => ({
    a: addBytesCarry(a, h, flags.c).result,
    flags: {
      z: addBytesCarry(a, h, flags.c).z,
      n: 0,
      h: addBytesCarry(a, h, flags.c).h,
      c: addBytesCarry(a, h, flags.c).c,
    },
  }),
});

testInstruction('ADC A, L', {
  instruction: 0x8d,
  duration: 4,
  effect: ({ a, l, flags }) => ({
    a: addBytesCarry(a, l, flags.c).result,
    flags: {
      z: addBytesCarry(a, l, flags.c).z,
      n: 0,
      h: addBytesCarry(a, l, flags.c).h,
      c: addBytesCarry(a, l, flags.c).c,
    },
  }),
});

testInstruction('ADC A, (HL)', {
  instruction: 0x8e,
  duration: 8,
  effect: ({ a, hl, memory, flags }) => ({
    a: addBytesCarry(a, memory[hl], flags.c).result,
    flags: {
      z: addBytesCarry(a, memory[hl], flags.c).z,
      n: 0,
      h: addBytesCarry(a, memory[hl], flags.c).h,
      c: addBytesCarry(a, memory[hl], flags.c).c,
    },
  }),
});

testInstruction('ADC A, A', {
  instruction: 0x8f,
  duration: 4,
  effect: ({ a, flags }) => ({
    a: addBytesCarry(a, a, flags.c).result,
    flags: {
      z: addBytesCarry(a, a, flags.c).z,
      n: 0,
      h: addBytesCarry(a, a, flags.c).h,
      c: addBytesCarry(a, a, flags.c).c,
    },
  }),
});

testInstruction('ADD d8', {
  instruction: 0xc6,
  duration: 8,
  size: 2,
  effect: ({ pc, memory, a }) => ({
    a: addBytes(a, memory[pc + 1]).result,
    flags: {
      z: addBytes(a, memory[pc + 1]).z,
      n: 0,
      h: addBytes(a, memory[pc + 1]).h,
      c: addBytes(a, memory[pc + 1]).c,
    },
  }),
});

testInstruction('ADC A, d8', {
  instruction: 0xce,
  duration: 8,
  size: 2,
  effect: ({ pc, memory, a, flags }) => ({
    a: addBytesCarry(a, memory[pc + 1], flags.c).result,
    flags: {
      z: addBytesCarry(a, memory[pc + 1], flags.c).z,
      n: 0,
      h: addBytesCarry(a, memory[pc + 1], flags.c).h,
      c: addBytesCarry(a, memory[pc + 1], flags.c).c,
    },
  }),
});

testInstruction('ADD SP, r8', {
  instruction: 0xe8,
  duration: 16,
  size: 2,
  effect: ({ pc, sp, memory }) => ({
    sp: addSignedOffset(sp, memory[pc + 1]).result,
    flags: {
      z: 0,
      n: 0,
      h: addSignedOffset(sp, memory[pc + 1]).h,
      c: addSignedOffset(sp, memory[pc + 1]).c,
    },
  }),
});
