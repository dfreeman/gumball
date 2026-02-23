import testInstruction from '#tests/helpers/test-instruction';
import { byte } from '#src/utils/sized-numbers';

testInstruction('RES 0 B', {
  instruction: [0xcb, 0x80],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b & ~(1 << 0)),
  }),
});

testInstruction('RES 0 C', {
  instruction: [0xcb, 0x81],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c & ~(1 << 0)),
  }),
});

testInstruction('RES 0 D', {
  instruction: [0xcb, 0x82],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d & ~(1 << 0)),
  }),
});

testInstruction('RES 0 E', {
  instruction: [0xcb, 0x83],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e & ~(1 << 0)),
  }),
});

testInstruction('RES 0 H', {
  instruction: [0xcb, 0x84],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h & ~(1 << 0)),
  }),
});

testInstruction('RES 0 L', {
  instruction: [0xcb, 0x85],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l & ~(1 << 0)),
  }),
});

testInstruction('RES 0 (HL)', {
  instruction: [0xcb, 0x86],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] & ~(1 << 0)) },
  }),
});

testInstruction('RES 0 A', {
  instruction: [0xcb, 0x87],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a & ~(1 << 0)),
  }),
});

testInstruction('RES 1 B', {
  instruction: [0xcb, 0x88],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b & ~(1 << 1)),
  }),
});

testInstruction('RES 1 C', {
  instruction: [0xcb, 0x89],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c & ~(1 << 1)),
  }),
});

testInstruction('RES 1 D', {
  instruction: [0xcb, 0x8a],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d & ~(1 << 1)),
  }),
});

testInstruction('RES 1 E', {
  instruction: [0xcb, 0x8b],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e & ~(1 << 1)),
  }),
});

testInstruction('RES 1 H', {
  instruction: [0xcb, 0x8c],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h & ~(1 << 1)),
  }),
});

testInstruction('RES 1 L', {
  instruction: [0xcb, 0x8d],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l & ~(1 << 1)),
  }),
});

testInstruction('RES 1 (HL)', {
  instruction: [0xcb, 0x8e],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] & ~(1 << 1)) },
  }),
});

testInstruction('RES 1 A', {
  instruction: [0xcb, 0x8f],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a & ~(1 << 1)),
  }),
});

testInstruction('RES 2 B', {
  instruction: [0xcb, 0x90],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b & ~(1 << 2)),
  }),
});

testInstruction('RES 2 C', {
  instruction: [0xcb, 0x91],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c & ~(1 << 2)),
  }),
});

testInstruction('RES 2 D', {
  instruction: [0xcb, 0x92],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d & ~(1 << 2)),
  }),
});

testInstruction('RES 2 E', {
  instruction: [0xcb, 0x93],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e & ~(1 << 2)),
  }),
});

testInstruction('RES 2 H', {
  instruction: [0xcb, 0x94],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h & ~(1 << 2)),
  }),
});

testInstruction('RES 2 L', {
  instruction: [0xcb, 0x95],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l & ~(1 << 2)),
  }),
});

testInstruction('RES 2 (HL)', {
  instruction: [0xcb, 0x96],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] & ~(1 << 2)) },
  }),
});

testInstruction('RES 2 A', {
  instruction: [0xcb, 0x97],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a & ~(1 << 2)),
  }),
});

testInstruction('RES 3 B', {
  instruction: [0xcb, 0x98],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b & ~(1 << 3)),
  }),
});

testInstruction('RES 3 C', {
  instruction: [0xcb, 0x99],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c & ~(1 << 3)),
  }),
});

testInstruction('RES 3 D', {
  instruction: [0xcb, 0x9a],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d & ~(1 << 3)),
  }),
});

testInstruction('RES 3 E', {
  instruction: [0xcb, 0x9b],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e & ~(1 << 3)),
  }),
});

testInstruction('RES 3 H', {
  instruction: [0xcb, 0x9c],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h & ~(1 << 3)),
  }),
});

testInstruction('RES 3 L', {
  instruction: [0xcb, 0x9d],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l & ~(1 << 3)),
  }),
});

testInstruction('RES 3 (HL)', {
  instruction: [0xcb, 0x9e],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] & ~(1 << 3)) },
  }),
});

testInstruction('RES 3 A', {
  instruction: [0xcb, 0x9f],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a & ~(1 << 3)),
  }),
});

testInstruction('RES 4 B', {
  instruction: [0xcb, 0xa0],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b & ~(1 << 4)),
  }),
});

testInstruction('RES 4 C', {
  instruction: [0xcb, 0xa1],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c & ~(1 << 4)),
  }),
});

testInstruction('RES 4 D', {
  instruction: [0xcb, 0xa2],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d & ~(1 << 4)),
  }),
});

testInstruction('RES 4 E', {
  instruction: [0xcb, 0xa3],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e & ~(1 << 4)),
  }),
});

testInstruction('RES 4 H', {
  instruction: [0xcb, 0xa4],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h & ~(1 << 4)),
  }),
});

testInstruction('RES 4 L', {
  instruction: [0xcb, 0xa5],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l & ~(1 << 4)),
  }),
});

testInstruction('RES 4 (HL)', {
  instruction: [0xcb, 0xa6],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] & ~(1 << 4)) },
  }),
});

testInstruction('RES 4 A', {
  instruction: [0xcb, 0xa7],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a & ~(1 << 4)),
  }),
});

testInstruction('RES 5 B', {
  instruction: [0xcb, 0xa8],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b & ~(1 << 5)),
  }),
});

testInstruction('RES 5 C', {
  instruction: [0xcb, 0xa9],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c & ~(1 << 5)),
  }),
});

testInstruction('RES 5 D', {
  instruction: [0xcb, 0xaa],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d & ~(1 << 5)),
  }),
});

testInstruction('RES 5 E', {
  instruction: [0xcb, 0xab],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e & ~(1 << 5)),
  }),
});

testInstruction('RES 5 H', {
  instruction: [0xcb, 0xac],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h & ~(1 << 5)),
  }),
});

testInstruction('RES 5 L', {
  instruction: [0xcb, 0xad],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l & ~(1 << 5)),
  }),
});

testInstruction('RES 5 (HL)', {
  instruction: [0xcb, 0xae],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] & ~(1 << 5)) },
  }),
});

testInstruction('RES 5 A', {
  instruction: [0xcb, 0xaf],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a & ~(1 << 5)),
  }),
});

testInstruction('RES 6 B', {
  instruction: [0xcb, 0xb0],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b & ~(1 << 6)),
  }),
});

testInstruction('RES 6 C', {
  instruction: [0xcb, 0xb1],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c & ~(1 << 6)),
  }),
});

testInstruction('RES 6 D', {
  instruction: [0xcb, 0xb2],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d & ~(1 << 6)),
  }),
});

testInstruction('RES 6 E', {
  instruction: [0xcb, 0xb3],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e & ~(1 << 6)),
  }),
});

testInstruction('RES 6 H', {
  instruction: [0xcb, 0xb4],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h & ~(1 << 6)),
  }),
});

testInstruction('RES 6 L', {
  instruction: [0xcb, 0xb5],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l & ~(1 << 6)),
  }),
});

testInstruction('RES 6 (HL)', {
  instruction: [0xcb, 0xb6],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] & ~(1 << 6)) },
  }),
});

testInstruction('RES 6 A', {
  instruction: [0xcb, 0xb7],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a & ~(1 << 6)),
  }),
});

testInstruction('RES 7 B', {
  instruction: [0xcb, 0xb8],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b & ~(1 << 7)),
  }),
});

testInstruction('RES 7 C', {
  instruction: [0xcb, 0xb9],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c & ~(1 << 7)),
  }),
});

testInstruction('RES 7 D', {
  instruction: [0xcb, 0xba],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d & ~(1 << 7)),
  }),
});

testInstruction('RES 7 E', {
  instruction: [0xcb, 0xbb],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e & ~(1 << 7)),
  }),
});

testInstruction('RES 7 H', {
  instruction: [0xcb, 0xbc],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h & ~(1 << 7)),
  }),
});

testInstruction('RES 7 L', {
  instruction: [0xcb, 0xbd],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l & ~(1 << 7)),
  }),
});

testInstruction('RES 7 (HL)', {
  instruction: [0xcb, 0xbe],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] & ~(1 << 7)) },
  }),
});

testInstruction('RES 7 A', {
  instruction: [0xcb, 0xbf],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a & ~(1 << 7)),
  }),
});
