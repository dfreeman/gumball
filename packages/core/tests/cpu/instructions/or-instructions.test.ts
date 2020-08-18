import testInstruction from '../../helpers/test-instruction';
import { byte, bit } from '../../../src/utils/sized-numbers';

testInstruction('OR B', {
  instruction: 0xb0,
  duration: 4,
  effect: ({ a, b }) => ({
    a: byte(a | b),
    flags: {
      z: bit((a | b) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('OR C', {
  instruction: 0xb1,
  duration: 4,
  effect: ({ a, c }) => ({
    a: byte(a | c),
    flags: {
      z: bit((a | c) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('OR D', {
  instruction: 0xb2,
  duration: 4,
  effect: ({ a, d }) => ({
    a: byte(a | d),
    flags: {
      z: bit((a | d) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('OR E', {
  instruction: 0xb3,
  duration: 4,
  effect: ({ a, e }) => ({
    a: byte(a | e),
    flags: {
      z: bit((a | e) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('OR H', {
  instruction: 0xb4,
  duration: 4,
  effect: ({ a, h }) => ({
    a: byte(a | h),
    flags: {
      z: bit((a | h) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('OR L', {
  instruction: 0xb5,
  duration: 4,
  effect: ({ a, l }) => ({
    a: byte(a | l),
    flags: {
      z: bit((a | l) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('OR (HL)', {
  instruction: 0xb6,
  duration: 8,
  effect: ({ a, memory, hl }) => ({
    a: byte(a | memory[hl]),
    flags: {
      z: bit((a | memory[hl]) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('OR A', {
  instruction: 0xb7,
  duration: 4,
  effect: ({ a }) => ({
    flags: {
      z: bit(a === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});

testInstruction('OR d8', {
  instruction: 0xf6,
  duration: 8,
  size: 2,
  effect: ({ a, memory, pc }) => ({
    a: byte(memory[pc + 1] | a),
    flags: {
      z: bit((memory[pc + 1] | a) === 0),
      n: 0,
      h: 0,
      c: 0,
    },
  }),
});
