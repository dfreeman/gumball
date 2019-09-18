import testInstruction from '../helpers/test-instruction';
import { subtractBytesCarry, subtractBytes } from '../../src/utils';

testInstruction('SUB A, B', {
  instruction: 0x90,
  duration: 4,
  effect: ({ a, b }) => ({
    a: subtractBytes(a, b).result,
    flags: {
      z: subtractBytes(a, b).z,
      n: 1,
      h: subtractBytes(a, b).h,
      c: subtractBytes(a, b).c,
    },
  }),
});

testInstruction('SUB A, C', {
  instruction: 0x91,
  duration: 4,
  effect: ({ a, c }) => ({
    a: subtractBytes(a, c).result,
    flags: {
      z: subtractBytes(a, c).z,
      n: 1,
      h: subtractBytes(a, c).h,
      c: subtractBytes(a, c).c,
    },
  }),
});

testInstruction('SUB A, D', {
  instruction: 0x92,
  duration: 4,
  effect: ({ a, d }) => ({
    a: subtractBytes(a, d).result,
    flags: {
      z: subtractBytes(a, d).z,
      n: 1,
      h: subtractBytes(a, d).h,
      c: subtractBytes(a, d).c,
    },
  }),
});

testInstruction('SUB A, E', {
  instruction: 0x93,
  duration: 4,
  effect: ({ a, e }) => ({
    a: subtractBytes(a, e).result,
    flags: {
      z: subtractBytes(a, e).z,
      n: 1,
      h: subtractBytes(a, e).h,
      c: subtractBytes(a, e).c,
    },
  }),
});

testInstruction('SUB A, H', {
  instruction: 0x94,
  duration: 4,
  effect: ({ a, h }) => ({
    a: subtractBytes(a, h).result,
    flags: {
      z: subtractBytes(a, h).z,
      n: 1,
      h: subtractBytes(a, h).h,
      c: subtractBytes(a, h).c,
    },
  }),
});

testInstruction('SUB A, L', {
  instruction: 0x95,
  duration: 4,
  effect: ({ a, l }) => ({
    a: subtractBytes(a, l).result,
    flags: {
      z: subtractBytes(a, l).z,
      n: 1,
      h: subtractBytes(a, l).h,
      c: subtractBytes(a, l).c,
    },
  }),
});

testInstruction('SUB A, (HL)', {
  instruction: 0x96,
  duration: 8,
  effect: ({ a, hl, memory }) => ({
    a: subtractBytes(a, memory[hl]).result,
    flags: {
      z: subtractBytes(a, memory[hl]).z,
      n: 1,
      h: subtractBytes(a, memory[hl]).h,
      c: subtractBytes(a, memory[hl]).c,
    },
  }),
});

testInstruction('SUB A, A', {
  instruction: 0x97,
  duration: 4,
  effect: ({ a }) => ({
    a: subtractBytes(a, a).result,
    flags: {
      z: subtractBytes(a, a).z,
      n: 1,
      h: subtractBytes(a, a).h,
      c: subtractBytes(a, a).c,
    },
  }),
});

testInstruction('SBC A, B', {
  instruction: 0x98,
  duration: 4,
  effect: ({ a, b, flags }) => ({
    a: subtractBytesCarry(a, b, flags.c).result,
    flags: {
      z: subtractBytesCarry(a, b, flags.c).z,
      n: 1,
      h: subtractBytesCarry(a, b, flags.c).h,
      c: subtractBytesCarry(a, b, flags.c).c,
    },
  }),
});

testInstruction('SBC A, C', {
  instruction: 0x99,
  duration: 4,
  effect: ({ a, c, flags }) => ({
    a: subtractBytesCarry(a, c, flags.c).result,
    flags: {
      z: subtractBytesCarry(a, c, flags.c).z,
      n: 1,
      h: subtractBytesCarry(a, c, flags.c).h,
      c: subtractBytesCarry(a, c, flags.c).c,
    },
  }),
});

testInstruction('SBC A, D', {
  instruction: 0x9a,
  duration: 4,
  effect: ({ a, d, flags }) => ({
    a: subtractBytesCarry(a, d, flags.c).result,
    flags: {
      z: subtractBytesCarry(a, d, flags.c).z,
      n: 1,
      h: subtractBytesCarry(a, d, flags.c).h,
      c: subtractBytesCarry(a, d, flags.c).c,
    },
  }),
});

testInstruction('SBC A, E', {
  instruction: 0x9b,
  duration: 4,
  effect: ({ a, e, flags }) => ({
    a: subtractBytesCarry(a, e, flags.c).result,
    flags: {
      z: subtractBytesCarry(a, e, flags.c).z,
      n: 1,
      h: subtractBytesCarry(a, e, flags.c).h,
      c: subtractBytesCarry(a, e, flags.c).c,
    },
  }),
});

testInstruction('SBC A, H', {
  instruction: 0x9c,
  duration: 4,
  effect: ({ a, h, flags }) => ({
    a: subtractBytesCarry(a, h, flags.c).result,
    flags: {
      z: subtractBytesCarry(a, h, flags.c).z,
      n: 1,
      h: subtractBytesCarry(a, h, flags.c).h,
      c: subtractBytesCarry(a, h, flags.c).c,
    },
  }),
});

testInstruction('SBC A, L', {
  instruction: 0x9d,
  duration: 4,
  effect: ({ a, l, flags }) => ({
    a: subtractBytesCarry(a, l, flags.c).result,
    flags: {
      z: subtractBytesCarry(a, l, flags.c).z,
      n: 1,
      h: subtractBytesCarry(a, l, flags.c).h,
      c: subtractBytesCarry(a, l, flags.c).c,
    },
  }),
});

testInstruction('SBC A, (HL)', {
  instruction: 0x9e,
  duration: 8,
  effect: ({ a, hl, memory, flags }) => ({
    a: subtractBytesCarry(a, memory[hl], flags.c).result,
    flags: {
      z: subtractBytesCarry(a, memory[hl], flags.c).z,
      n: 1,
      h: subtractBytesCarry(a, memory[hl], flags.c).h,
      c: subtractBytesCarry(a, memory[hl], flags.c).c,
    },
  }),
});

testInstruction('SBC A, A', {
  instruction: 0x9f,
  duration: 4,
  effect: ({ a, flags }) => ({
    a: subtractBytesCarry(a, a, flags.c).result,
    flags: {
      z: subtractBytesCarry(a, a, flags.c).z,
      n: 1,
      h: subtractBytesCarry(a, a, flags.c).h,
      c: subtractBytesCarry(a, a, flags.c).c,
    },
  }),
});

testInstruction('SUB d8', {
  instruction: 0xd6,
  duration: 8,
  size: 2,
  effect: ({ pc, memory, a }) => ({
    a: subtractBytes(a, memory[pc + 1]).result,
    flags: {
      z: subtractBytes(a, memory[pc + 1]).z,
      n: 0,
      h: subtractBytes(a, memory[pc + 1]).h,
      c: subtractBytes(a, memory[pc + 1]).c,
    },
  }),
});

testInstruction('SBC A, d8', {
  instruction: 0xde,
  duration: 8,
  size: 2,
  effect: ({ pc, memory, a, flags }) => ({
    a: subtractBytesCarry(a, memory[pc + 1], flags.c).result,
    flags: {
      z: subtractBytesCarry(a, memory[pc + 1], flags.c).z,
      n: 0,
      h: subtractBytesCarry(a, memory[pc + 1], flags.c).h,
      c: subtractBytesCarry(a, memory[pc + 1], flags.c).c,
    },
  }),
});
