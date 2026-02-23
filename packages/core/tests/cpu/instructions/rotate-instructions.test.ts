import testInstruction from '#tests/helpers/test-instruction';
import { rotateLeft, rotateRight } from '#src/utils/data';
import { bit } from '#src/utils/sized-numbers';

testInstruction('RLCA', {
  instruction: 0x07,
  duration: 4,
  effect: ({ a }) => ({
    a: rotateLeft(a).result,
    flags: {
      z: 0,
      n: 0,
      h: 0,
      c: rotateLeft(a).c,
    },
  }),
});

testInstruction('RRCA', {
  instruction: 0x0f,
  duration: 4,
  effect: ({ a }) => ({
    a: rotateRight(a).result,
    flags: {
      z: 0,
      n: 0,
      h: 0,
      c: rotateRight(a).c,
    },
  }),
});

testInstruction('RLA', {
  instruction: 0x17,
  duration: 4,
  effect: ({ a, flags }) => ({
    a: rotateLeft(a, flags.c).result,
    flags: {
      z: 0,
      n: 0,
      h: 0,
      c: bit(a & 0x80),
    },
  }),
});

testInstruction('RRA', {
  instruction: 0x1f,
  duration: 4,
  effect: ({ a, flags }) => ({
    a: rotateRight(a, flags.c).result,
    flags: {
      z: 0,
      n: 0,
      h: 0,
      c: rotateRight(a, flags.c).c,
    },
  }),
});

testInstruction('RLC B', {
  instruction: [0xcb, 0x00],
  duration: 8,
  effect: ({ b }) => ({
    b: rotateLeft(b).result,
    flags: {
      z: rotateLeft(b).z,
      n: 0,
      h: 0,
      c: rotateLeft(b).c,
    },
  }),
});

testInstruction('RLC C', {
  instruction: [0xcb, 0x01],
  duration: 8,
  effect: ({ c }) => ({
    c: rotateLeft(c).result,
    flags: {
      z: rotateLeft(c).z,
      n: 0,
      h: 0,
      c: rotateLeft(c).c,
    },
  }),
});

testInstruction('RLC D', {
  instruction: [0xcb, 0x02],
  duration: 8,
  effect: ({ d }) => ({
    d: rotateLeft(d).result,
    flags: {
      z: rotateLeft(d).z,
      n: 0,
      h: 0,
      c: rotateLeft(d).c,
    },
  }),
});

testInstruction('RLC E', {
  instruction: [0xcb, 0x03],
  duration: 8,
  effect: ({ e }) => ({
    e: rotateLeft(e).result,
    flags: {
      z: rotateLeft(e).z,
      n: 0,
      h: 0,
      c: rotateLeft(e).c,
    },
  }),
});

testInstruction('RLC H', {
  instruction: [0xcb, 0x04],
  duration: 8,
  effect: ({ h }) => ({
    h: rotateLeft(h).result,
    flags: {
      z: rotateLeft(h).z,
      n: 0,
      h: 0,
      c: rotateLeft(h).c,
    },
  }),
});

testInstruction('RLC L', {
  instruction: [0xcb, 0x05],
  duration: 8,
  effect: ({ l }) => ({
    l: rotateLeft(l).result,
    flags: {
      z: rotateLeft(l).z,
      n: 0,
      h: 0,
      c: rotateLeft(l).c,
    },
  }),
});

testInstruction('RLC (HL)', {
  instruction: [0xcb, 0x06],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: rotateLeft(memory[hl]).result },
    flags: {
      z: rotateLeft(memory[hl]).z,
      n: 0,
      h: 0,
      c: rotateLeft(memory[hl]).c,
    },
  }),
});

testInstruction('RLC A', {
  instruction: [0xcb, 0x07],
  duration: 8,
  effect: ({ a }) => ({
    a: rotateLeft(a).result,
    flags: {
      z: rotateLeft(a).z,
      n: 0,
      h: 0,
      c: rotateLeft(a).c,
    },
  }),
});

testInstruction('RRC B', {
  instruction: [0xcb, 0x08],
  duration: 8,
  effect: ({ b }) => ({
    b: rotateRight(b).result,
    flags: {
      z: rotateRight(b).z,
      n: 0,
      h: 0,
      c: rotateRight(b).c,
    },
  }),
});

testInstruction('RRC C', {
  instruction: [0xcb, 0x09],
  duration: 8,
  effect: ({ c }) => ({
    c: rotateRight(c).result,
    flags: {
      z: rotateRight(c).z,
      n: 0,
      h: 0,
      c: rotateRight(c).c,
    },
  }),
});

testInstruction('RRC D', {
  instruction: [0xcb, 0x0a],
  duration: 8,
  effect: ({ d }) => ({
    d: rotateRight(d).result,
    flags: {
      z: rotateRight(d).z,
      n: 0,
      h: 0,
      c: rotateRight(d).c,
    },
  }),
});

testInstruction('RRC E', {
  instruction: [0xcb, 0x0b],
  duration: 8,
  effect: ({ e }) => ({
    e: rotateRight(e).result,
    flags: {
      z: rotateRight(e).z,
      n: 0,
      h: 0,
      c: rotateRight(e).c,
    },
  }),
});

testInstruction('RRC H', {
  instruction: [0xcb, 0x0c],
  duration: 8,
  effect: ({ h }) => ({
    h: rotateRight(h).result,
    flags: {
      z: rotateRight(h).z,
      n: 0,
      h: 0,
      c: rotateRight(h).c,
    },
  }),
});

testInstruction('RRC L', {
  instruction: [0xcb, 0x0d],
  duration: 8,
  effect: ({ l }) => ({
    l: rotateRight(l).result,
    flags: {
      z: rotateRight(l).z,
      n: 0,
      h: 0,
      c: rotateRight(l).c,
    },
  }),
});

testInstruction('RRC (HL)', {
  instruction: [0xcb, 0x0e],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: rotateRight(memory[hl]).result },
    flags: {
      z: rotateRight(memory[hl]).z,
      n: 0,
      h: 0,
      c: rotateRight(memory[hl]).c,
    },
  }),
});

testInstruction('RRC A', {
  instruction: [0xcb, 0x0f],
  duration: 8,
  effect: ({ a }) => ({
    a: rotateRight(a).result,
    flags: {
      z: rotateRight(a).z,
      n: 0,
      h: 0,
      c: rotateRight(a).c,
    },
  }),
});

testInstruction('RL B', {
  instruction: [0xcb, 0x10],
  duration: 8,
  effect: ({ b, flags }) => ({
    b: rotateLeft(b, flags.c).result,
    flags: {
      z: rotateLeft(b, flags.c).z,
      n: 0,
      h: 0,
      c: rotateLeft(b, flags.c).c,
    },
  }),
});

testInstruction('RL C', {
  instruction: [0xcb, 0x11],
  duration: 8,
  effect: ({ c, flags }) => ({
    c: rotateLeft(c, flags.c).result,
    flags: {
      z: rotateLeft(c, flags.c).z,
      n: 0,
      h: 0,
      c: rotateLeft(c, flags.c).c,
    },
  }),
});

testInstruction('RL D', {
  instruction: [0xcb, 0x12],
  duration: 8,
  effect: ({ d, flags }) => ({
    d: rotateLeft(d, flags.c).result,
    flags: {
      z: rotateLeft(d, flags.c).z,
      n: 0,
      h: 0,
      c: rotateLeft(d, flags.c).c,
    },
  }),
});

testInstruction('RL E', {
  instruction: [0xcb, 0x13],
  duration: 8,
  effect: ({ e, flags }) => ({
    e: rotateLeft(e, flags.c).result,
    flags: {
      z: rotateLeft(e, flags.c).z,
      n: 0,
      h: 0,
      c: rotateLeft(e, flags.c).c,
    },
  }),
});

testInstruction('RL H', {
  instruction: [0xcb, 0x14],
  duration: 8,
  effect: ({ h, flags }) => ({
    h: rotateLeft(h, flags.c).result,
    flags: {
      z: rotateLeft(h, flags.c).z,
      n: 0,
      h: 0,
      c: rotateLeft(h, flags.c).c,
    },
  }),
});

testInstruction('RL L', {
  instruction: [0xcb, 0x15],
  duration: 8,
  effect: ({ l, flags }) => ({
    l: rotateLeft(l, flags.c).result,
    flags: {
      z: rotateLeft(l, flags.c).z,
      n: 0,
      h: 0,
      c: rotateLeft(l, flags.c).c,
    },
  }),
});

testInstruction('RL (HL)', {
  instruction: [0xcb, 0x16],
  duration: 16,
  effect: ({ hl, memory, flags }) => ({
    memory: { [hl]: rotateLeft(memory[hl], flags.c).result },
    flags: {
      z: rotateLeft(memory[hl], flags.c).z,
      n: 0,
      h: 0,
      c: rotateLeft(memory[hl], flags.c).c,
    },
  }),
});

testInstruction('RL A', {
  instruction: [0xcb, 0x17],
  duration: 8,
  effect: ({ a, flags }) => ({
    a: rotateLeft(a, flags.c).result,
    flags: {
      z: rotateLeft(a, flags.c).z,
      n: 0,
      h: 0,
      c: rotateLeft(a, flags.c).c,
    },
  }),
});

testInstruction('RR B', {
  instruction: [0xcb, 0x18],
  duration: 8,
  effect: ({ b, flags }) => ({
    b: rotateRight(b, flags.c).result,
    flags: {
      z: rotateRight(b, flags.c).z,
      n: 0,
      h: 0,
      c: rotateRight(b, flags.c).c,
    },
  }),
});

testInstruction('RR C', {
  instruction: [0xcb, 0x19],
  duration: 8,
  effect: ({ c, flags }) => ({
    c: rotateRight(c, flags.c).result,
    flags: {
      z: rotateRight(c, flags.c).z,
      n: 0,
      h: 0,
      c: rotateRight(c, flags.c).c,
    },
  }),
});

testInstruction('RR D', {
  instruction: [0xcb, 0x1a],
  duration: 8,
  effect: ({ d, flags }) => ({
    d: rotateRight(d, flags.c).result,
    flags: {
      z: rotateRight(d, flags.c).z,
      n: 0,
      h: 0,
      c: rotateRight(d, flags.c).c,
    },
  }),
});

testInstruction('RR E', {
  instruction: [0xcb, 0x1b],
  duration: 8,
  effect: ({ e, flags }) => ({
    e: rotateRight(e, flags.c).result,
    flags: {
      z: rotateRight(e, flags.c).z,
      n: 0,
      h: 0,
      c: rotateRight(e, flags.c).c,
    },
  }),
});

testInstruction('RR H', {
  instruction: [0xcb, 0x1c],
  duration: 8,
  effect: ({ h, flags }) => ({
    h: rotateRight(h, flags.c).result,
    flags: {
      z: rotateRight(h, flags.c).z,
      n: 0,
      h: 0,
      c: rotateRight(h, flags.c).c,
    },
  }),
});

testInstruction('RR L', {
  instruction: [0xcb, 0x1d],
  duration: 8,
  effect: ({ l, flags }) => ({
    l: rotateRight(l, flags.c).result,
    flags: {
      z: rotateRight(l, flags.c).z,
      n: 0,
      h: 0,
      c: rotateRight(l, flags.c).c,
    },
  }),
});

testInstruction('RR (HL)', {
  instruction: [0xcb, 0x1e],
  duration: 16,
  effect: ({ hl, memory, flags }) => ({
    memory: { [hl]: rotateRight(memory[hl], flags.c).result },
    flags: {
      z: rotateRight(memory[hl], flags.c).z,
      n: 0,
      h: 0,
      c: rotateRight(memory[hl], flags.c).c,
    },
  }),
});

testInstruction('RR A', {
  instruction: [0xcb, 0x1f],
  duration: 8,
  effect: ({ a, flags }) => ({
    a: rotateRight(a, flags.c).result,
    flags: {
      z: rotateRight(a, flags.c).z,
      n: 0,
      h: 0,
      c: rotateRight(a, flags.c).c,
    },
  }),
});
