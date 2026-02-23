import testInstruction from '#tests/helpers/test-instruction';
import { subtractBytes } from '#src/utils/data';

testInstruction('CP B', {
  instruction: 0xb8,
  duration: 4,
  effect: ({ a, b }) => ({
    flags: {
      z: subtractBytes(a, b).z,
      n: 1,
      h: subtractBytes(a, b).h,
      c: subtractBytes(a, b).c,
    },
  }),
});

testInstruction('CP C', {
  instruction: 0xb9,
  duration: 4,
  effect: ({ a, c }) => ({
    flags: {
      z: subtractBytes(a, c).z,
      n: 1,
      h: subtractBytes(a, c).h,
      c: subtractBytes(a, c).c,
    },
  }),
});

testInstruction('CP D', {
  instruction: 0xba,
  duration: 4,
  effect: ({ a, d }) => ({
    flags: {
      z: subtractBytes(a, d).z,
      n: 1,
      h: subtractBytes(a, d).h,
      c: subtractBytes(a, d).c,
    },
  }),
});

testInstruction('CP E', {
  instruction: 0xbb,
  duration: 4,
  effect: ({ a, e }) => ({
    flags: {
      z: subtractBytes(a, e).z,
      n: 1,
      h: subtractBytes(a, e).h,
      c: subtractBytes(a, e).c,
    },
  }),
});

testInstruction('CP H', {
  instruction: 0xbc,
  duration: 4,
  effect: ({ a, h }) => ({
    flags: {
      z: subtractBytes(a, h).z,
      n: 1,
      h: subtractBytes(a, h).h,
      c: subtractBytes(a, h).c,
    },
  }),
});

testInstruction('CP L', {
  instruction: 0xbd,
  duration: 4,
  effect: ({ a, l }) => ({
    flags: {
      z: subtractBytes(a, l).z,
      n: 1,
      h: subtractBytes(a, l).h,
      c: subtractBytes(a, l).c,
    },
  }),
});

testInstruction('CP (HL)', {
  instruction: 0xbe,
  duration: 8,
  effect: ({ a, memory, hl }) => ({
    flags: {
      z: subtractBytes(a, memory[hl]).z,
      n: 1,
      h: subtractBytes(a, memory[hl]).h,
      c: subtractBytes(a, memory[hl]).c,
    },
  }),
});

testInstruction('CP A', {
  instruction: 0xbf,
  duration: 4,
  effect: () => ({
    flags: {
      z: 1,
      n: 1,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('CP d8', {
  instruction: 0xfe,
  duration: 8,
  size: 2,
  effect: ({ a, pc, memory }) => ({
    flags: {
      z: subtractBytes(a, memory[pc + 1]).z,
      n: 1,
      h: subtractBytes(a, memory[pc + 1]).h,
      c: subtractBytes(a, memory[pc + 1]).c,
    },
  }),
});
