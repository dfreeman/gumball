import testInstruction from '../helpers/test-instruction';
import { word, byte } from '../../src/sized';

testInstruction('RET NZ', {
  instruction: 0xc0,
  duration: (flags) => (flags.z ? 8 : 20),
  effect: ({ sp, pc, memory, flags }) => ({
    pc: flags.z ? word(pc + 1) : word(memory[sp] + (memory[sp + 1] << 8)),
    sp: flags.z ? sp : word(sp + 2),
  }),
});

testInstruction('POP BC', {
  instruction: 0xc1,
  duration: 12,
  effect: ({ sp, memory }) => ({
    bc: word(memory[sp] + (memory[sp + 1] << 8)),
    sp: word(sp + 2),
  }),
});

testInstruction('CALL NZ, a16', {
  instruction: 0xc4,
  duration: (flags) => (flags.z ? 12 : 24),
  size: 3,
  effect: ({ sp, memory, pc, flags }) => ({
    sp: flags.z ? sp : word(sp - 2),
    pc: flags.z ? word(pc + 3) : word(memory[pc + 1] + (memory[pc + 2] << 8)),
    memory: flags.z
      ? {}
      : {
          [word(sp - 2)]: byte(pc + 3),
          [word(sp - 1)]: byte((pc + 3) >> 8),
        },
  }),
});

testInstruction('PUSH BC', {
  instruction: 0xc5,
  duration: 16,
  effect: ({ sp, bc }) => ({
    sp: word(sp - 2),
    memory: {
      [word(sp - 2)]: byte(bc),
      [word(sp - 1)]: byte(bc >> 8),
    },
  }),
});

testInstruction('RET Z', {
  instruction: 0xc8,
  duration: (flags) => (flags.z ? 20 : 8),
  effect: ({ memory, sp, pc, flags }) => ({
    pc: flags.z ? word(memory[sp] + (memory[sp + 1] << 8)) : word(pc + 1),
    sp: flags.z ? word(sp + 2) : sp,
  }),
});

testInstruction('RET', {
  instruction: 0xc9,
  duration: 16,
  effect: ({ memory, sp }) => ({
    pc: word(memory[sp] + (memory[sp + 1] << 8)),
    sp: word(sp + 2),
  }),
});

testInstruction('CALL Z, a16', {
  instruction: 0xcc,
  duration: (flags) => (flags.z ? 24 : 12),
  size: 3,
  effect: ({ sp, memory, pc, flags }) => ({
    sp: flags.z ? word(sp - 2) : sp,
    pc: flags.z ? word(memory[pc + 1] + (memory[pc + 2] << 8)) : word(pc + 3),
    memory: flags.z
      ? {
          [word(sp - 2)]: byte(pc + 3),
          [word(sp - 1)]: byte((pc + 3) >> 8),
        }
      : {},
  }),
});

testInstruction('CALL a16', {
  instruction: 0xcd,
  duration: 24,
  size: 3,
  effect: ({ sp, memory, pc }) => ({
    sp: word(sp - 2),
    pc: word(memory[pc + 1] + (memory[pc + 2] << 8)),
    memory: {
      [word(sp - 2)]: byte(pc + 3),
      [word(sp - 1)]: byte((pc + 3) >> 8),
    },
  }),
});

testInstruction('RET NC', {
  instruction: 0xd0,
  duration: (flags) => (flags.c ? 8 : 20),
  effect: ({ memory, sp, pc, flags }) => ({
    pc: flags.c ? word(pc + 1) : word(memory[sp] + (memory[sp + 1] << 8)),
    sp: flags.c ? sp : word(sp + 2),
  }),
});

testInstruction('POP DE', {
  instruction: 0xd1,
  duration: 12,
  effect: ({ sp, memory }) => ({
    de: word(memory[sp] + (memory[sp + 1] << 8)),
    sp: word(sp + 2),
  }),
});

testInstruction('CALL NC, a16', {
  instruction: 0xd4,
  duration: (flags) => (flags.c ? 12 : 24),
  size: 3,
  effect: ({ sp, memory, pc, flags }) => ({
    sp: flags.c ? sp : word(sp - 2),
    pc: flags.c ? word(pc + 3) : word(memory[pc + 1] + (memory[pc + 2] << 8)),
    memory: flags.c
      ? {}
      : {
          [word(sp - 2)]: byte(pc + 3),
          [word(sp - 1)]: byte((pc + 3) >> 8),
        },
  }),
});

testInstruction('PUSH DE', {
  instruction: 0xd5,
  duration: 16,
  effect: ({ sp, de }) => ({
    sp: word(sp - 2),
    memory: {
      [word(sp - 2)]: byte(de),
      [word(sp - 1)]: byte(de >> 8),
    },
  }),
});

testInstruction('RET C', {
  instruction: 0xd8,
  duration: (flags) => (flags.c ? 20 : 8),
  effect: ({ memory, sp, pc, flags }) => ({
    pc: flags.c ? word(memory[sp] + (memory[sp + 1] << 8)) : word(pc + 1),
    sp: flags.c ? word(sp + 2) : sp,
  }),
});

testInstruction('RETI', {
  instruction: 0xd9,
  duration: 16,
  effect: ({ memory, sp }) => ({
    pc: word(memory[sp] + (memory[sp + 1] << 8)),
    sp: word(sp + 2),
  }),
  after(cpu) {
    expect(cpu.interruptsEnabled).toBe(true);
  },
});

testInstruction('CALL C, a16', {
  instruction: 0xdc,
  duration: (flags) => (flags.c ? 24 : 12),
  size: 3,
  effect: ({ sp, memory, pc, flags }) => ({
    sp: flags.c ? word(sp - 2) : sp,
    pc: flags.c ? word(memory[pc + 1] + (memory[pc + 2] << 8)) : word(pc + 3),
    memory: flags.c
      ? {
          [word(sp - 2)]: byte(pc + 3),
          [word(sp - 1)]: byte((pc + 3) >> 8),
        }
      : {},
  }),
});

testInstruction('POP HL', {
  instruction: 0xe1,
  duration: 12,
  effect: ({ sp, memory }) => ({
    hl: word(memory[sp] + (memory[sp + 1] << 8)),
    sp: word(sp + 2),
  }),
});

testInstruction('PUSH HL', {
  instruction: 0xe5,
  duration: 16,
  effect: ({ sp, hl }) => ({
    sp: word(sp - 2),
    memory: {
      [word(sp - 2)]: byte(hl),
      [word(sp - 1)]: byte(hl >> 8),
    },
  }),
});

testInstruction('POP AF', {
  instruction: 0xf1,
  duration: 12,
  effect: ({ sp, memory }) => ({
    af: word(memory[sp] + (memory[sp + 1] << 8)),
    sp: word(sp + 2),
  }),
});

testInstruction('PUSH AF', {
  instruction: 0xf5,
  duration: 16,
  effect: ({ sp, af }) => ({
    sp: word(sp - 2),
    memory: {
      [word(sp - 2)]: byte(af),
      [word(sp - 1)]: byte(af >> 8),
    },
  }),
});
