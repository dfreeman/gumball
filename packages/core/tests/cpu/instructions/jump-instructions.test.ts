import testInstruction from '#tests/helpers/test-instruction';
import { word } from '#src/utils/sized-numbers';
import { signedByte } from '#src/utils/data';

testInstruction('JR r8', {
  instruction: 0x18,
  duration: 12,
  size: 2,
  effect: ({ pc, memory }) => ({
    pc: word(pc + 2 + signedByte(memory[pc + 1])),
  }),
});

testInstruction('JR NZ, r8', {
  instruction: 0x20,
  duration: (flags) => (flags.z ? 8 : 12),
  size: 2,
  effect: ({ pc, memory, flags }) => ({
    pc: word(pc + 2 + (flags.z ? 0 : signedByte(memory[pc + 1]))),
  }),
});

testInstruction('JR Z, r8', {
  instruction: 0x28,
  duration: (flags) => (flags.z ? 12 : 8),
  size: 2,
  effect: ({ pc, memory, flags }) => ({
    pc: word(pc + 2 + (flags.z ? signedByte(memory[pc + 1]) : 0)),
  }),
});

testInstruction('JR NC, r8', {
  instruction: 0x30,
  duration: (flags) => (flags.c ? 8 : 12),
  size: 2,
  effect: ({ pc, memory, flags }) => ({
    pc: word(pc + 2 + (flags.c ? 0 : signedByte(memory[pc + 1]))),
  }),
});

testInstruction('JR C, r8', {
  instruction: 0x38,
  duration: (flags) => (flags.c ? 12 : 8),
  size: 2,
  effect: ({ pc, memory, flags }) => ({
    pc: word(pc + 2 + (flags.c ? signedByte(memory[pc + 1]) : 0)),
  }),
});

testInstruction('JP NZ, a16', {
  instruction: 0xc2,
  duration: (flags) => (flags.z ? 12 : 16),
  size: 3,
  effect: ({ pc, flags, memory }) => ({
    pc: flags.z ? word(pc + 3) : word(memory[pc + 1] + (memory[pc + 2] << 8)),
  }),
});

testInstruction('JP a16', {
  instruction: 0xc3,
  duration: 16,
  size: 3,
  effect: ({ pc, memory }) => ({
    pc: word(memory[pc + 1] + (memory[pc + 2] << 8)),
  }),
});

testInstruction('JP Z, a16', {
  instruction: 0xca,
  duration: (flags) => (flags.z ? 16 : 12),
  size: 3,
  effect: ({ pc, flags, memory }) => ({
    pc: flags.z ? word(memory[pc + 1] + (memory[pc + 2] << 8)) : word(pc + 3),
  }),
});

testInstruction('JP NC, a16', {
  instruction: 0xd2,
  duration: (flags) => (flags.c ? 12 : 16),
  size: 3,
  effect: ({ pc, flags, memory }) => ({
    pc: flags.c ? word(pc + 3) : word(memory[pc + 1] + (memory[pc + 2] << 8)),
  }),
});

testInstruction('JP C, a16', {
  instruction: 0xda,
  duration: (flags) => (flags.c ? 16 : 12),
  size: 3,
  effect: ({ pc, flags, memory }) => ({
    pc: flags.c ? word(memory[pc + 1] + (memory[pc + 2] << 8)) : word(pc + 3),
  }),
});

testInstruction('JP HL', {
  instruction: 0xe9,
  duration: 4,
  effect: ({ hl }) => ({
    pc: hl,
  }),
});
