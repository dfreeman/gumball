import testInstruction from '../../helpers/test-instruction';
import { byte } from '../../../src/utils/sized-numbers';

testInstruction('SET 0 B', {
  instruction: [0xcb, 0xc0],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b | (1 << 0)),
  }),
});

testInstruction('SET 0 C', {
  instruction: [0xcb, 0xc1],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c | (1 << 0)),
  }),
});

testInstruction('SET 0 D', {
  instruction: [0xcb, 0xc2],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d | (1 << 0)),
  }),
});

testInstruction('SET 0 E', {
  instruction: [0xcb, 0xc3],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e | (1 << 0)),
  }),
});

testInstruction('SET 0 H', {
  instruction: [0xcb, 0xc4],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h | (1 << 0)),
  }),
});

testInstruction('SET 0 L', {
  instruction: [0xcb, 0xc5],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l | (1 << 0)),
  }),
});

testInstruction('SET 0 (HL)', {
  instruction: [0xcb, 0xc6],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] | (1 << 0)) },
  }),
});

testInstruction('SET 0 A', {
  instruction: [0xcb, 0xc7],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a | (1 << 0)),
  }),
});

testInstruction('SET 1 B', {
  instruction: [0xcb, 0xc8],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b | (1 << 1)),
  }),
});

testInstruction('SET 1 C', {
  instruction: [0xcb, 0xc9],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c | (1 << 1)),
  }),
});

testInstruction('SET 1 D', {
  instruction: [0xcb, 0xca],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d | (1 << 1)),
  }),
});

testInstruction('SET 1 E', {
  instruction: [0xcb, 0xcb],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e | (1 << 1)),
  }),
});

testInstruction('SET 1 H', {
  instruction: [0xcb, 0xcc],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h | (1 << 1)),
  }),
});

testInstruction('SET 1 L', {
  instruction: [0xcb, 0xcd],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l | (1 << 1)),
  }),
});

testInstruction('SET 1 (HL)', {
  instruction: [0xcb, 0xce],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] | (1 << 1)) },
  }),
});

testInstruction('SET 1 A', {
  instruction: [0xcb, 0xcf],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a | (1 << 1)),
  }),
});

testInstruction('SET 2 B', {
  instruction: [0xcb, 0xd0],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b | (1 << 2)),
  }),
});

testInstruction('SET 2 C', {
  instruction: [0xcb, 0xd1],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c | (1 << 2)),
  }),
});

testInstruction('SET 2 D', {
  instruction: [0xcb, 0xd2],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d | (1 << 2)),
  }),
});

testInstruction('SET 2 E', {
  instruction: [0xcb, 0xd3],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e | (1 << 2)),
  }),
});

testInstruction('SET 2 H', {
  instruction: [0xcb, 0xd4],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h | (1 << 2)),
  }),
});

testInstruction('SET 2 L', {
  instruction: [0xcb, 0xd5],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l | (1 << 2)),
  }),
});

testInstruction('SET 2 (HL)', {
  instruction: [0xcb, 0xd6],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] | (1 << 2)) },
  }),
});

testInstruction('SET 2 A', {
  instruction: [0xcb, 0xd7],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a | (1 << 2)),
  }),
});

testInstruction('SET 3 B', {
  instruction: [0xcb, 0xd8],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b | (1 << 3)),
  }),
});

testInstruction('SET 3 C', {
  instruction: [0xcb, 0xd9],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c | (1 << 3)),
  }),
});

testInstruction('SET 3 D', {
  instruction: [0xcb, 0xda],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d | (1 << 3)),
  }),
});

testInstruction('SET 3 E', {
  instruction: [0xcb, 0xdb],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e | (1 << 3)),
  }),
});

testInstruction('SET 3 H', {
  instruction: [0xcb, 0xdc],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h | (1 << 3)),
  }),
});

testInstruction('SET 3 L', {
  instruction: [0xcb, 0xdd],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l | (1 << 3)),
  }),
});

testInstruction('SET 3 (HL)', {
  instruction: [0xcb, 0xde],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] | (1 << 3)) },
  }),
});

testInstruction('SET 3 A', {
  instruction: [0xcb, 0xdf],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a | (1 << 3)),
  }),
});

testInstruction('SET 4 B', {
  instruction: [0xcb, 0xe0],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b | (1 << 4)),
  }),
});

testInstruction('SET 4 C', {
  instruction: [0xcb, 0xe1],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c | (1 << 4)),
  }),
});

testInstruction('SET 4 D', {
  instruction: [0xcb, 0xe2],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d | (1 << 4)),
  }),
});

testInstruction('SET 4 E', {
  instruction: [0xcb, 0xe3],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e | (1 << 4)),
  }),
});

testInstruction('SET 4 H', {
  instruction: [0xcb, 0xe4],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h | (1 << 4)),
  }),
});

testInstruction('SET 4 L', {
  instruction: [0xcb, 0xe5],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l | (1 << 4)),
  }),
});

testInstruction('SET 4 (HL)', {
  instruction: [0xcb, 0xe6],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] | (1 << 4)) },
  }),
});

testInstruction('SET 4 A', {
  instruction: [0xcb, 0xe7],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a | (1 << 4)),
  }),
});

testInstruction('SET 5 B', {
  instruction: [0xcb, 0xe8],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b | (1 << 5)),
  }),
});

testInstruction('SET 5 C', {
  instruction: [0xcb, 0xe9],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c | (1 << 5)),
  }),
});

testInstruction('SET 5 D', {
  instruction: [0xcb, 0xea],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d | (1 << 5)),
  }),
});

testInstruction('SET 5 E', {
  instruction: [0xcb, 0xeb],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e | (1 << 5)),
  }),
});

testInstruction('SET 5 H', {
  instruction: [0xcb, 0xec],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h | (1 << 5)),
  }),
});

testInstruction('SET 5 L', {
  instruction: [0xcb, 0xed],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l | (1 << 5)),
  }),
});

testInstruction('SET 5 (HL)', {
  instruction: [0xcb, 0xee],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] | (1 << 5)) },
  }),
});

testInstruction('SET 5 A', {
  instruction: [0xcb, 0xef],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a | (1 << 5)),
  }),
});

testInstruction('SET 6 B', {
  instruction: [0xcb, 0xf0],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b | (1 << 6)),
  }),
});

testInstruction('SET 6 C', {
  instruction: [0xcb, 0xf1],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c | (1 << 6)),
  }),
});

testInstruction('SET 6 D', {
  instruction: [0xcb, 0xf2],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d | (1 << 6)),
  }),
});

testInstruction('SET 6 E', {
  instruction: [0xcb, 0xf3],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e | (1 << 6)),
  }),
});

testInstruction('SET 6 H', {
  instruction: [0xcb, 0xf4],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h | (1 << 6)),
  }),
});

testInstruction('SET 6 L', {
  instruction: [0xcb, 0xf5],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l | (1 << 6)),
  }),
});

testInstruction('SET 6 (HL)', {
  instruction: [0xcb, 0xf6],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] | (1 << 6)) },
  }),
});

testInstruction('SET 6 A', {
  instruction: [0xcb, 0xf7],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a | (1 << 6)),
  }),
});

testInstruction('SET 7 B', {
  instruction: [0xcb, 0xf8],
  duration: 8,
  effect: ({ b }) => ({
    b: byte(b | (1 << 7)),
  }),
});

testInstruction('SET 7 C', {
  instruction: [0xcb, 0xf9],
  duration: 8,
  effect: ({ c }) => ({
    c: byte(c | (1 << 7)),
  }),
});

testInstruction('SET 7 D', {
  instruction: [0xcb, 0xfa],
  duration: 8,
  effect: ({ d }) => ({
    d: byte(d | (1 << 7)),
  }),
});

testInstruction('SET 7 E', {
  instruction: [0xcb, 0xfb],
  duration: 8,
  effect: ({ e }) => ({
    e: byte(e | (1 << 7)),
  }),
});

testInstruction('SET 7 H', {
  instruction: [0xcb, 0xfc],
  duration: 8,
  effect: ({ h }) => ({
    h: byte(h | (1 << 7)),
  }),
});

testInstruction('SET 7 L', {
  instruction: [0xcb, 0xfd],
  duration: 8,
  effect: ({ l }) => ({
    l: byte(l | (1 << 7)),
  }),
});

testInstruction('SET 7 (HL)', {
  instruction: [0xcb, 0xfe],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: byte(memory[hl] | (1 << 7)) },
  }),
});

testInstruction('SET 7 A', {
  instruction: [0xcb, 0xff],
  duration: 8,
  effect: ({ a }) => ({
    a: byte(a | (1 << 7)),
  }),
});
