import testInstruction from '../helpers/test-instruction';
import { bit, byte } from '../../src/sized';

testInstruction('AND B', {
  instruction: 0xa0,
  duration: 4,
  effect: ({ a, b }) => ({
    a: byte(a & b),
    flags: {
      z: bit((a & b) === 0),
      n: 0,
      h: 1,
      c: 0,
    },
  }),
});

testInstruction('AND C', {
  instruction: 0xa1,
  duration: 4,
  effect: ({ a, c }) => ({
    a: byte(a & c),
    flags: {
      z: bit((a & c) === 0),
      n: 0,
      h: 1,
      c: 0,
    },
  }),
});

testInstruction('AND D', {
  instruction: 0xa2,
  duration: 4,
  effect: ({ a, d }) => ({
    a: byte(a & d),
    flags: {
      z: bit((a & d) === 0),
      n: 0,
      h: 1,
      c: 0,
    },
  }),
});

testInstruction('AND E', {
  instruction: 0xa3,
  duration: 4,
  effect: ({ a, e }) => ({
    a: byte(a & e),
    flags: {
      z: bit((a & e) === 0),
      n: 0,
      h: 1,
      c: 0,
    },
  }),
});

testInstruction('AND H', {
  instruction: 0xa4,
  duration: 4,
  effect: ({ a, h }) => ({
    a: byte(a & h),
    flags: {
      z: bit((a & h) === 0),
      n: 0,
      h: 1,
      c: 0,
    },
  }),
});

testInstruction('AND L', {
  instruction: 0xa5,
  duration: 4,
  effect: ({ a, l }) => ({
    a: byte(a & l),
    flags: {
      z: bit((a & l) === 0),
      n: 0,
      h: 1,
      c: 0,
    },
  }),
});

testInstruction('AND (HL)', {
  instruction: 0xa6,
  duration: 8,
  effect: ({ a, hl, memory }) => ({
    a: byte(a & memory[hl]),
    flags: {
      z: bit((a & memory[hl]) === 0),
      n: 0,
      h: 1,
      c: 0,
    },
  }),
});

testInstruction('AND A', {
  instruction: 0xa7,
  duration: 4,
  effect: ({ a }) => ({
    flags: {
      z: bit(a === 0),
      n: 0,
      h: 1,
      c: 0,
    },
  }),
});

testInstruction('AND d8', {
  instruction: 0xe6,
  duration: 8,
  size: 2,
  effect: ({ a, memory, pc }) => ({
    a: byte(memory[pc + 1] & a),
    flags: {
      z: bit((memory[pc + 1] & a) === 0),
      n: 0,
      h: 1,
      c: 0,
    },
  }),
});
