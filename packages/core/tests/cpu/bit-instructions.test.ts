import testInstruction from '../helpers/test-instruction';
import { bit } from '../../src/sized';

testInstruction('BIT 0 B', {
  instruction: [0xcb, 0x40],
  duration: 8,
  effect: ({ b }) => ({
    flags: {
      z: bit(!(b & 0x01)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 0 C', {
  instruction: [0xcb, 0x41],
  duration: 8,
  effect: ({ c }) => ({
    flags: {
      z: bit(!(c & 0x01)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 0 D', {
  instruction: [0xcb, 0x42],
  duration: 8,
  effect: ({ d }) => ({
    flags: {
      z: bit(!(d & 0x01)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 0 E', {
  instruction: [0xcb, 0x43],
  duration: 8,
  effect: ({ e }) => ({
    flags: {
      z: bit(!(e & 0x01)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 0 H', {
  instruction: [0xcb, 0x44],
  duration: 8,
  effect: ({ h }) => ({
    flags: {
      z: bit(!(h & 0x01)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 0 L', {
  instruction: [0xcb, 0x45],
  duration: 8,
  effect: ({ l }) => ({
    flags: {
      z: bit(!(l & 0x01)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 0 (HL)', {
  instruction: [0xcb, 0x46],
  duration: 12,
  effect: ({ hl, memory }) => ({
    flags: {
      z: bit(!(memory[hl] & 0x01)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 0 A', {
  instruction: [0xcb, 0x47],
  duration: 8,
  effect: ({ a }) => ({
    flags: {
      z: bit(!(a & 0x01)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 1 B', {
  instruction: [0xcb, 0x48],
  duration: 8,
  effect: ({ b }) => ({
    flags: {
      z: bit(!(b & 0x02)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 1 C', {
  instruction: [0xcb, 0x49],
  duration: 8,
  effect: ({ c }) => ({
    flags: {
      z: bit(!(c & 0x02)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 1 D', {
  instruction: [0xcb, 0x4a],
  duration: 8,
  effect: ({ d }) => ({
    flags: {
      z: bit(!(d & 0x02)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 1 E', {
  instruction: [0xcb, 0x4b],
  duration: 8,
  effect: ({ e }) => ({
    flags: {
      z: bit(!(e & 0x02)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 1 H', {
  instruction: [0xcb, 0x4c],
  duration: 8,
  effect: ({ h }) => ({
    flags: {
      z: bit(!(h & 0x02)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 1 L', {
  instruction: [0xcb, 0x4d],
  duration: 8,
  effect: ({ l }) => ({
    flags: {
      z: bit(!(l & 0x02)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 1 (HL)', {
  instruction: [0xcb, 0x4e],
  duration: 12,
  effect: ({ hl, memory }) => ({
    flags: {
      z: bit(!(memory[hl] & 0x02)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 1 A', {
  instruction: [0xcb, 0x4f],
  duration: 8,
  effect: ({ a }) => ({
    flags: {
      z: bit(!(a & 0x02)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 2 B', {
  instruction: [0xcb, 0x50],
  duration: 8,
  effect: ({ b }) => ({
    flags: {
      z: bit(!(b & 0x04)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 2 C', {
  instruction: [0xcb, 0x51],
  duration: 8,
  effect: ({ c }) => ({
    flags: {
      z: bit(!(c & 0x04)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 2 D', {
  instruction: [0xcb, 0x52],
  duration: 8,
  effect: ({ d }) => ({
    flags: {
      z: bit(!(d & 0x04)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 2 E', {
  instruction: [0xcb, 0x53],
  duration: 8,
  effect: ({ e }) => ({
    flags: {
      z: bit(!(e & 0x04)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 2 H', {
  instruction: [0xcb, 0x54],
  duration: 8,
  effect: ({ h }) => ({
    flags: {
      z: bit(!(h & 0x04)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 2 L', {
  instruction: [0xcb, 0x55],
  duration: 8,
  effect: ({ l }) => ({
    flags: {
      z: bit(!(l & 0x04)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 2 (HL)', {
  instruction: [0xcb, 0x56],
  duration: 12,
  effect: ({ hl, memory }) => ({
    flags: {
      z: bit(!(memory[hl] & 0x04)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 2 A', {
  instruction: [0xcb, 0x57],
  duration: 8,
  effect: ({ a }) => ({
    flags: {
      z: bit(!(a & 0x04)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 3 B', {
  instruction: [0xcb, 0x58],
  duration: 8,
  effect: ({ b }) => ({
    flags: {
      z: bit(!(b & 0x08)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 3 C', {
  instruction: [0xcb, 0x59],
  duration: 8,
  effect: ({ c }) => ({
    flags: {
      z: bit(!(c & 0x08)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 3 D', {
  instruction: [0xcb, 0x5a],
  duration: 8,
  effect: ({ d }) => ({
    flags: {
      z: bit(!(d & 0x08)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 3 E', {
  instruction: [0xcb, 0x5b],
  duration: 8,
  effect: ({ e }) => ({
    flags: {
      z: bit(!(e & 0x08)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 3 H', {
  instruction: [0xcb, 0x5c],
  duration: 8,
  effect: ({ h }) => ({
    flags: {
      z: bit(!(h & 0x08)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 3 L', {
  instruction: [0xcb, 0x5d],
  duration: 8,
  effect: ({ l }) => ({
    flags: {
      z: bit(!(l & 0x08)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 3 (HL)', {
  instruction: [0xcb, 0x5e],
  duration: 12,
  effect: ({ hl, memory }) => ({
    flags: {
      z: bit(!(memory[hl] & 0x08)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 3 A', {
  instruction: [0xcb, 0x5f],
  duration: 8,
  effect: ({ a }) => ({
    flags: {
      z: bit(!(a & 0x08)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 4 B', {
  instruction: [0xcb, 0x60],
  duration: 8,
  effect: ({ b }) => ({
    flags: {
      z: bit(!(b & 0x10)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 4 C', {
  instruction: [0xcb, 0x61],
  duration: 8,
  effect: ({ c }) => ({
    flags: {
      z: bit(!(c & 0x10)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 4 D', {
  instruction: [0xcb, 0x62],
  duration: 8,
  effect: ({ d }) => ({
    flags: {
      z: bit(!(d & 0x10)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 4 E', {
  instruction: [0xcb, 0x63],
  duration: 8,
  effect: ({ e }) => ({
    flags: {
      z: bit(!(e & 0x10)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 4 H', {
  instruction: [0xcb, 0x64],
  duration: 8,
  effect: ({ h }) => ({
    flags: {
      z: bit(!(h & 0x10)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 4 L', {
  instruction: [0xcb, 0x65],
  duration: 8,
  effect: ({ l }) => ({
    flags: {
      z: bit(!(l & 0x10)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 4 (HL)', {
  instruction: [0xcb, 0x66],
  duration: 12,
  effect: ({ hl, memory }) => ({
    flags: {
      z: bit(!(memory[hl] & 0x10)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 4 A', {
  instruction: [0xcb, 0x67],
  duration: 8,
  effect: ({ a }) => ({
    flags: {
      z: bit(!(a & 0x10)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 5 B', {
  instruction: [0xcb, 0x68],
  duration: 8,
  effect: ({ b }) => ({
    flags: {
      z: bit(!(b & 0x20)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 5 C', {
  instruction: [0xcb, 0x69],
  duration: 8,
  effect: ({ c }) => ({
    flags: {
      z: bit(!(c & 0x20)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 5 D', {
  instruction: [0xcb, 0x6a],
  duration: 8,
  effect: ({ d }) => ({
    flags: {
      z: bit(!(d & 0x20)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 5 E', {
  instruction: [0xcb, 0x6b],
  duration: 8,
  effect: ({ e }) => ({
    flags: {
      z: bit(!(e & 0x20)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 5 H', {
  instruction: [0xcb, 0x6c],
  duration: 8,
  effect: ({ h }) => ({
    flags: {
      z: bit(!(h & 0x20)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 5 L', {
  instruction: [0xcb, 0x6d],
  duration: 8,
  effect: ({ l }) => ({
    flags: {
      z: bit(!(l & 0x20)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 5 (HL)', {
  instruction: [0xcb, 0x6e],
  duration: 12,
  effect: ({ hl, memory }) => ({
    flags: {
      z: bit(!(memory[hl] & 0x20)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 5 A', {
  instruction: [0xcb, 0x6f],
  duration: 8,
  effect: ({ a }) => ({
    flags: {
      z: bit(!(a & 0x20)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 6 B', {
  instruction: [0xcb, 0x70],
  duration: 8,
  effect: ({ b }) => ({
    flags: {
      z: bit(!(b & 0x40)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 6 C', {
  instruction: [0xcb, 0x71],
  duration: 8,
  effect: ({ c }) => ({
    flags: {
      z: bit(!(c & 0x40)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 6 D', {
  instruction: [0xcb, 0x72],
  duration: 8,
  effect: ({ d }) => ({
    flags: {
      z: bit(!(d & 0x40)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 6 E', {
  instruction: [0xcb, 0x73],
  duration: 8,
  effect: ({ e }) => ({
    flags: {
      z: bit(!(e & 0x40)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 6 H', {
  instruction: [0xcb, 0x74],
  duration: 8,
  effect: ({ h }) => ({
    flags: {
      z: bit(!(h & 0x40)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 6 L', {
  instruction: [0xcb, 0x75],
  duration: 8,
  effect: ({ l }) => ({
    flags: {
      z: bit(!(l & 0x40)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 6 (HL)', {
  instruction: [0xcb, 0x76],
  duration: 12,
  effect: ({ hl, memory }) => ({
    flags: {
      z: bit(!(memory[hl] & 0x40)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 6 A', {
  instruction: [0xcb, 0x77],
  duration: 8,
  effect: ({ a }) => ({
    flags: {
      z: bit(!(a & 0x40)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 7 B', {
  instruction: [0xcb, 0x78],
  duration: 8,
  effect: ({ b }) => ({
    flags: {
      z: bit(!(b & 0x80)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 7 C', {
  instruction: [0xcb, 0x79],
  duration: 8,
  effect: ({ c }) => ({
    flags: {
      z: bit(!(c & 0x80)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 7 D', {
  instruction: [0xcb, 0x7a],
  duration: 8,
  effect: ({ d }) => ({
    flags: {
      z: bit(!(d & 0x80)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 7 E', {
  instruction: [0xcb, 0x7b],
  duration: 8,
  effect: ({ e }) => ({
    flags: {
      z: bit(!(e & 0x80)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 7 H', {
  instruction: [0xcb, 0x7c],
  duration: 8,
  effect: ({ h }) => ({
    flags: {
      z: bit(!(h & 0x80)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 7 L', {
  instruction: [0xcb, 0x7d],
  duration: 8,
  effect: ({ l }) => ({
    flags: {
      z: bit(!(l & 0x80)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 7 (HL)', {
  instruction: [0xcb, 0x7e],
  duration: 12,
  effect: ({ hl, memory }) => ({
    flags: {
      z: bit(!(memory[hl] & 0x80)),
      n: 0,
      h: 1,
    },
  }),
});

testInstruction('BIT 7 A', {
  instruction: [0xcb, 0x7f],
  duration: 8,
  effect: ({ a }) => ({
    flags: {
      z: bit(!(a & 0x80)),
      n: 0,
      h: 1,
    },
  }),
});
