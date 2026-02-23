import testInstruction from '#tests/helpers/test-instruction';
import { subtractBytes, addBytes, subtractWords } from '#src/utils/data';
import { word } from '#src/utils/sized-numbers';

testInstruction('INC BC', {
  instruction: 0x03,
  duration: 8,
  effect: ({ bc }) => ({
    bc: word(bc + 1),
  }),
});

testInstruction('INC B', {
  instruction: 0x04,
  duration: 4,
  effect: ({ b }) => ({
    b: addBytes(b, 1).result,
    flags: {
      z: addBytes(b, 1).z,
      n: 0,
      h: addBytes(b, 1).h,
    },
  }),
});

testInstruction('DEC B', {
  instruction: 0x05,
  duration: 4,
  effect: ({ b }) => ({
    b: subtractBytes(b, 1).result,
    flags: {
      z: subtractBytes(b, 1).z,
      n: 1,
      h: subtractBytes(b, 1).h,
    },
  }),
});

testInstruction('DEC BC', {
  instruction: 0x0b,
  duration: 8,
  effect: ({ bc }) => ({
    bc: word(bc - 1),
  }),
});

testInstruction('INC C', {
  instruction: 0x0c,
  duration: 4,
  effect: ({ c }) => ({
    c: addBytes(c, 1).result,
    flags: {
      z: addBytes(c, 1).z,
      n: 0,
      h: addBytes(c, 1).h,
    },
  }),
});

testInstruction('DEC C', {
  instruction: 0x0d,
  duration: 4,
  effect: ({ c }) => ({
    c: subtractBytes(c, 1).result,
    flags: {
      z: subtractBytes(c, 1).z,
      n: 1,
      h: subtractBytes(c, 1).h,
    },
  }),
});

testInstruction('INC DE', {
  instruction: 0x13,
  duration: 8,
  effect: ({ de }) => ({
    de: word(de + 1),
  }),
});

testInstruction('INC D', {
  instruction: 0x14,
  duration: 4,
  effect: ({ d }) => ({
    d: addBytes(d, 1).result,
    flags: {
      z: addBytes(d, 1).z,
      n: 0,
      h: addBytes(d, 1).h,
    },
  }),
});

testInstruction('DEC D', {
  instruction: 0x15,
  duration: 4,
  effect: ({ d }) => ({
    d: subtractBytes(d, 1).result,
    flags: {
      z: subtractBytes(d, 1).z,
      n: 1,
      h: subtractBytes(d, 1).h,
    },
  }),
});

testInstruction('DEC DE', {
  instruction: 0x1b,
  duration: 8,
  effect: ({ de }) => ({
    de: subtractWords(de, 1).result,
  }),
});

testInstruction('INC E', {
  instruction: 0x1c,
  duration: 4,
  effect: ({ e }) => ({
    e: addBytes(e, 1).result,
    flags: {
      z: addBytes(e, 1).z,
      n: 0,
      h: addBytes(e, 1).h,
    },
  }),
});

testInstruction('DEC E', {
  instruction: 0x1d,
  duration: 4,
  effect: ({ e }) => ({
    e: subtractBytes(e, 1).result,
    flags: {
      z: subtractBytes(e, 1).z,
      n: 1,
      h: subtractBytes(e, 1).h,
    },
  }),
});

testInstruction('INC HL', {
  instruction: 0x23,
  duration: 8,
  effect: ({ hl }) => ({
    hl: word(hl + 1),
  }),
});

testInstruction('INC H', {
  instruction: 0x24,
  duration: 4,
  effect: ({ h }) => ({
    h: addBytes(h, 1).result,
    flags: {
      z: addBytes(h, 1).z,
      n: 0,
      h: addBytes(h, 1).h,
    },
  }),
});

testInstruction('DEC H', {
  instruction: 0x25,
  duration: 4,
  effect: ({ h }) => ({
    h: subtractBytes(h, 1).result,
    flags: {
      z: subtractBytes(h, 1).z,
      n: 1,
      h: subtractBytes(h, 1).h,
    },
  }),
});

testInstruction('DEC HL', {
  instruction: 0x2b,
  duration: 8,
  effect: ({ hl }) => ({
    hl: subtractWords(hl, 1).result,
  }),
});

testInstruction('INC L', {
  instruction: 0x2c,
  duration: 4,
  effect: ({ l }) => ({
    l: addBytes(l, 1).result,
    flags: {
      z: addBytes(l, 1).z,
      n: 0,
      h: addBytes(l, 1).h,
    },
  }),
});

testInstruction('DEC L', {
  instruction: 0x2d,
  duration: 4,
  effect: ({ l }) => ({
    l: subtractBytes(l, 1).result,
    flags: {
      z: subtractBytes(l, 1).z,
      n: 1,
      h: subtractBytes(l, 1).h,
    },
  }),
});

testInstruction('INC SP', {
  instruction: 0x33,
  duration: 8,
  effect: ({ sp }) => ({
    sp: word(sp + 1),
  }),
});

testInstruction('INC (HL)', {
  instruction: 0x34,
  duration: 12,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: addBytes(memory[hl], 1).result },
    flags: {
      z: addBytes(memory[hl], 1).z,
      n: 0,
      h: addBytes(memory[hl], 1).h,
    },
  }),
});

testInstruction('DEC (HL)', {
  instruction: 0x35,
  duration: 12,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: subtractBytes(memory[hl], 1).result },
    flags: {
      z: subtractBytes(memory[hl], 1).z,
      n: 1,
      h: subtractBytes(memory[hl], 1).h,
    },
  }),
});

testInstruction('DEC SP', {
  instruction: 0x3b,
  duration: 8,
  effect: ({ sp }) => ({
    sp: word(sp - 1),
  }),
});

testInstruction('INC A', {
  instruction: 0x3c,
  duration: 4,
  effect: ({ a }) => ({
    a: addBytes(a, 1).result,
    flags: {
      z: addBytes(a, 1).z,
      n: 0,
      h: addBytes(a, 1).h,
    },
  }),
});

testInstruction('DEC A', {
  instruction: 0x3d,
  duration: 4,
  effect: ({ a }) => ({
    a: subtractBytes(a, 1).result,
    flags: {
      z: subtractBytes(a, 1).z,
      n: 1,
      h: subtractBytes(a, 1).h,
    },
  }),
});
