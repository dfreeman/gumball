import testInstruction from '../helpers/test-instruction';
import { byte, bit } from '../../src/sized';

testInstruction('XOR B', {
  instruction: 0xa8,
  duration: 4,
  effect: ({ a, b }) => ({
    a: byte(a ^ b),
    flags: {
      z: bit((a ^ b) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('XOR C', {
  instruction: 0xa9,
  duration: 4,
  effect: ({ a, c }) => ({
    a: byte(a ^ c),
    flags: {
      z: bit((a ^ c) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('XOR D', {
  instruction: 0xaa,
  duration: 4,
  effect: ({ a, d }) => ({
    a: byte(a ^ d),
    flags: {
      z: bit((a ^ d) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('XOR E', {
  instruction: 0xab,
  duration: 4,
  effect: ({ a, e }) => ({
    a: byte(a ^ e),
    flags: {
      z: bit((a ^ e) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('XOR H', {
  instruction: 0xac,
  duration: 4,
  effect: ({ a, h }) => ({
    a: byte(a ^ h),
    flags: {
      z: bit((a ^ h) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('XOR L', {
  instruction: 0xad,
  duration: 4,
  effect: ({ a, l }) => ({
    a: byte(a ^ l),
    flags: {
      z: bit((a ^ l) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('XOR (HL)', {
  instruction: 0xae,
  duration: 8,
  effect: ({ a, memory, hl }) => ({
    a: byte(a ^ memory[hl]),
    flags: {
      z: bit((a ^ memory[hl]) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('XOR A', {
  instruction: 0xaf,
  duration: 4,
  effect: () => ({
    a: 0,
    flags: {
      z: 1,
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('XOR d8', {
  instruction: 0xee,
  duration: 8,
  size: 2,
  effect: ({ a, memory, pc }) => ({
    a: byte(memory[pc + 1] ^ a),
    flags: {
      z: bit((memory[pc + 1] ^ a) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});
