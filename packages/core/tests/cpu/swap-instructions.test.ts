import testInstruction from '../helpers/test-instruction';
import { swap } from '../../src/utils';

testInstruction('SWAP B', {
  instruction: [0xcb, 0x30],
  duration: 8,
  effect: ({ b }) => ({
    b: swap(b).result,
    flags: {
      z: swap(b).z,
      n: 0,
      h: 0,
      c: swap(b).c,
    },
  }),
});

testInstruction('SWAP C', {
  instruction: [0xcb, 0x31],
  duration: 8,
  effect: ({ c }) => ({
    c: swap(c).result,
    flags: {
      z: swap(c).z,
      n: 0,
      h: 0,
      c: swap(c).c,
    },
  }),
});

testInstruction('SWAP D', {
  instruction: [0xcb, 0x32],
  duration: 8,
  effect: ({ d }) => ({
    d: swap(d).result,
    flags: {
      z: swap(d).z,
      n: 0,
      h: 0,
      c: swap(d).c,
    },
  }),
});

testInstruction('SWAP E', {
  instruction: [0xcb, 0x33],
  duration: 8,
  effect: ({ e }) => ({
    e: swap(e).result,
    flags: {
      z: swap(e).z,
      n: 0,
      h: 0,
      c: swap(e).c,
    },
  }),
});

testInstruction('SWAP H', {
  instruction: [0xcb, 0x34],
  duration: 8,
  effect: ({ h }) => ({
    h: swap(h).result,
    flags: {
      z: swap(h).z,
      n: 0,
      h: 0,
      c: swap(h).c,
    },
  }),
});

testInstruction('SWAP L', {
  instruction: [0xcb, 0x35],
  duration: 8,
  effect: ({ l }) => ({
    l: swap(l).result,
    flags: {
      z: swap(l).z,
      n: 0,
      h: 0,
      c: swap(l).c,
    },
  }),
});

testInstruction('SWAP (HL)', {
  instruction: [0xcb, 0x36],
  duration: 16,
  effect: ({ hl, memory }) => ({
    memory: { [hl]: swap(memory[hl]).result },
    flags: {
      z: swap(memory[hl]).z,
      n: 0,
      h: 0,
      c: swap(memory[hl]).c,
    },
  }),
});

testInstruction('SWAP A', {
  instruction: [0xcb, 0x37],
  duration: 8,
  effect: ({ a }) => ({
    a: swap(a).result,
    flags: {
      z: swap(a).z,
      n: 0,
      h: 0,
      c: swap(a).c,
    },
  }),
});
