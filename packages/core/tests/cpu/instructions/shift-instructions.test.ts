import testInstruction from '../../helpers/test-instruction';
import { shiftLeftA, shiftRightA, shiftRightL } from '../../../src/utils/data';

testInstruction('SLA B', {
  instruction: [0xcb, 0x20],
  duration: 8,
  effect: ({ b }) => ({
    b: shiftLeftA(b).result,
    flags: {
      z: shiftLeftA(b).z,
      n: 0,
      h: 0,
      c: shiftLeftA(b).c,
    },
  }),
});

testInstruction('SLA C', {
  instruction: [0xcb, 0x21],
  duration: 8,
  effect: ({ c }) => ({
    c: shiftLeftA(c).result,
    flags: {
      z: shiftLeftA(c).z,
      n: 0,
      h: 0,
      c: shiftLeftA(c).c,
    },
  }),
});

testInstruction('SLA D', {
  instruction: [0xcb, 0x22],
  duration: 8,
  effect: ({ d }) => ({
    d: shiftLeftA(d).result,
    flags: {
      z: shiftLeftA(d).z,
      n: 0,
      h: 0,
      c: shiftLeftA(d).c,
    },
  }),
});

testInstruction('SLA E', {
  instruction: [0xcb, 0x23],
  duration: 8,
  effect: ({ e }) => ({
    e: shiftLeftA(e).result,
    flags: {
      z: shiftLeftA(e).z,
      n: 0,
      h: 0,
      c: shiftLeftA(e).c,
    },
  }),
});

testInstruction('SLA H', {
  instruction: [0xcb, 0x24],
  duration: 8,
  effect: ({ h }) => ({
    h: shiftLeftA(h).result,
    flags: {
      z: shiftLeftA(h).z,
      n: 0,
      h: 0,
      c: shiftLeftA(h).c,
    },
  }),
});

testInstruction('SLA L', {
  instruction: [0xcb, 0x25],
  duration: 8,
  effect: ({ l }) => ({
    l: shiftLeftA(l).result,
    flags: {
      z: shiftLeftA(l).z,
      n: 0,
      h: 0,
      c: shiftLeftA(l).c,
    },
  }),
});

testInstruction('SLA (HL)', {
  instruction: [0xcb, 0x26],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: shiftLeftA(memory[hl]).result },
    flags: {
      z: shiftLeftA(memory[hl]).z,
      n: 0,
      h: 0,
      c: shiftLeftA(memory[hl]).c,
    },
  }),
});

testInstruction('SLA A', {
  instruction: [0xcb, 0x27],
  duration: 8,
  effect: ({ a }) => ({
    a: shiftLeftA(a).result,
    flags: {
      z: shiftLeftA(a).z,
      n: 0,
      h: 0,
      c: shiftLeftA(a).c,
    },
  }),
});

testInstruction('SRA B', {
  instruction: [0xcb, 0x28],
  duration: 8,
  effect: ({ b }) => ({
    b: shiftRightA(b).result,
    flags: {
      z: shiftRightA(b).z,
      n: 0,
      h: 0,
      c: shiftRightA(b).c,
    },
  }),
});

testInstruction('SRA C', {
  instruction: [0xcb, 0x29],
  duration: 8,
  effect: ({ c }) => ({
    c: shiftRightA(c).result,
    flags: {
      z: shiftRightA(c).z,
      n: 0,
      h: 0,
      c: shiftRightA(c).c,
    },
  }),
});

testInstruction('SRA D', {
  instruction: [0xcb, 0x2a],
  duration: 8,
  effect: ({ d }) => ({
    d: shiftRightA(d).result,
    flags: {
      z: shiftRightA(d).z,
      n: 0,
      h: 0,
      c: shiftRightA(d).c,
    },
  }),
});

testInstruction('SRA E', {
  instruction: [0xcb, 0x2b],
  duration: 8,
  effect: ({ e }) => ({
    e: shiftRightA(e).result,
    flags: {
      z: shiftRightA(e).z,
      n: 0,
      h: 0,
      c: shiftRightA(e).c,
    },
  }),
});

testInstruction('SRA H', {
  instruction: [0xcb, 0x2c],
  duration: 8,
  effect: ({ h }) => ({
    h: shiftRightA(h).result,
    flags: {
      z: shiftRightA(h).z,
      n: 0,
      h: 0,
      c: shiftRightA(h).c,
    },
  }),
});

testInstruction('SRA L', {
  instruction: [0xcb, 0x2d],
  duration: 8,
  effect: ({ l }) => ({
    l: shiftRightA(l).result,
    flags: {
      z: shiftRightA(l).z,
      n: 0,
      h: 0,
      c: shiftRightA(l).c,
    },
  }),
});

testInstruction('SRA (HL)', {
  instruction: [0xcb, 0x2e],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: shiftRightA(memory[hl]).result },
    flags: {
      z: shiftRightA(memory[hl]).z,
      n: 0,
      h: 0,
      c: shiftRightA(memory[hl]).c,
    },
  }),
});

testInstruction('SRA A', {
  instruction: [0xcb, 0x2f],
  duration: 8,
  effect: ({ a }) => ({
    a: shiftRightA(a).result,
    flags: {
      z: shiftRightA(a).z,
      n: 0,
      h: 0,
      c: shiftRightA(a).c,
    },
  }),
});

testInstruction('SRL B', {
  instruction: [0xcb, 0x38],
  duration: 8,
  effect: ({ b }) => ({
    b: shiftRightL(b).result,
    flags: {
      z: shiftRightL(b).z,
      n: 0,
      h: 0,
      c: shiftRightL(b).c,
    },
  }),
});

testInstruction('SRL C', {
  instruction: [0xcb, 0x39],
  duration: 8,
  effect: ({ c }) => ({
    c: shiftRightL(c).result,
    flags: {
      z: shiftRightL(c).z,
      n: 0,
      h: 0,
      c: shiftRightL(c).c,
    },
  }),
});

testInstruction('SRL D', {
  instruction: [0xcb, 0x3a],
  duration: 8,
  effect: ({ d }) => ({
    d: shiftRightL(d).result,
    flags: {
      z: shiftRightL(d).z,
      n: 0,
      h: 0,
      c: shiftRightL(d).c,
    },
  }),
});

testInstruction('SRL E', {
  instruction: [0xcb, 0x3b],
  duration: 8,
  effect: ({ e }) => ({
    e: shiftRightL(e).result,
    flags: {
      z: shiftRightL(e).z,
      n: 0,
      h: 0,
      c: shiftRightL(e).c,
    },
  }),
});

testInstruction('SRL H', {
  instruction: [0xcb, 0x3c],
  duration: 8,
  effect: ({ h }) => ({
    h: shiftRightL(h).result,
    flags: {
      z: shiftRightL(h).z,
      n: 0,
      h: 0,
      c: shiftRightL(h).c,
    },
  }),
});

testInstruction('SRL L', {
  instruction: [0xcb, 0x3d],
  duration: 8,
  effect: ({ l }) => ({
    l: shiftRightL(l).result,
    flags: {
      z: shiftRightL(l).z,
      n: 0,
      h: 0,
      c: shiftRightL(l).c,
    },
  }),
});

testInstruction('SRL (HL)', {
  instruction: [0xcb, 0x3e],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: shiftRightL(memory[hl]).result },
    flags: {
      z: shiftRightL(memory[hl]).z,
      n: 0,
      h: 0,
      c: shiftRightL(memory[hl]).c,
    },
  }),
});

testInstruction('SRL A', {
  instruction: [0xcb, 0x3f],
  duration: 8,
  effect: ({ a }) => ({
    a: shiftRightL(a).result,
    flags: {
      z: shiftRightL(a).z,
      n: 0,
      h: 0,
      c: shiftRightL(a).c,
    },
  }),
});
