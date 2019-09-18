import testInstruction from '../helpers/test-instruction';
import { word, byte } from '../../src/sized';

testInstruction('RST 00H', {
  instruction: 0xc7,
  duration: 16,
  effect: ({ sp, pc }) => ({
    pc: 0,
    sp: word(sp - 2),
    memory: {
      [word(sp - 2)]: byte(pc + 1),
      [word(sp - 1)]: byte((pc + 1) >> 8),
    },
  }),
});

testInstruction('RST 08H', {
  instruction: 0xcf,
  duration: 16,
  effect: ({ sp, pc }) => ({
    pc: word(0x08),
    sp: word(sp - 2),
    memory: {
      [word(sp - 2)]: byte(pc + 1),
      [word(sp - 1)]: byte((pc + 1) >> 8),
    },
  }),
});

testInstruction('RST 10H', {
  instruction: 0xd7,
  duration: 16,
  effect: ({ sp, pc }) => ({
    pc: word(0x10),
    sp: word(sp - 2),
    memory: {
      [word(sp - 2)]: byte(pc + 1),
      [word(sp - 1)]: byte((pc + 1) >> 8),
    },
  }),
});

testInstruction('RST 18H', {
  instruction: 0xdf,
  duration: 16,
  effect: ({ sp, pc }) => ({
    pc: word(0x18),
    sp: word(sp - 2),
    memory: {
      [word(sp - 2)]: byte(pc + 1),
      [word(sp - 1)]: byte((pc + 1) >> 8),
    },
  }),
});

testInstruction('RST 20H', {
  instruction: 0xe7,
  duration: 16,
  effect: ({ sp, pc }) => ({
    pc: word(0x20),
    sp: word(sp - 2),
    memory: {
      [word(sp - 2)]: byte(pc + 1),
      [word(sp - 1)]: byte((pc + 1) >> 8),
    },
  }),
});

testInstruction('RST 28H', {
  instruction: 0xef,
  duration: 16,
  effect: ({ sp, pc }) => ({
    pc: word(0x28),
    sp: word(sp - 2),
    memory: {
      [word(sp - 2)]: byte(pc + 1),
      [word(sp - 1)]: byte((pc + 1) >> 8),
    },
  }),
});

testInstruction('RST 30H', {
  instruction: 0xf7,
  duration: 16,
  effect: ({ sp, pc }) => ({
    pc: word(0x30),
    sp: word(sp - 2),
    memory: {
      [word(sp - 2)]: byte(pc + 1),
      [word(sp - 1)]: byte((pc + 1) >> 8),
    },
  }),
});

testInstruction('RST 38H', {
  instruction: 0xff,
  duration: 16,
  effect: ({ sp, pc }) => ({
    pc: word(0x38),
    sp: word(sp - 2),
    memory: {
      [word(sp - 2)]: byte(pc + 1),
      [word(sp - 1)]: byte((pc + 1) >> 8),
    },
  }),
});
