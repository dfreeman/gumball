import testInstruction from '#tests/helpers/test-instruction';
import { byte, word } from '#src/utils/sized-numbers';
import { addWords, subtractWords, addSignedOffset } from '#src/utils/data';

testInstruction('LD BC, d16', {
  instruction: 0x01,
  duration: 12,
  size: 3,
  effect: ({ memory }) => ({
    b: memory[0x02],
    c: memory[0x01],
  }),
});

testInstruction('LD (BC), A', {
  instruction: 0x02,
  duration: 8,
  effect: ({ a, bc }) => ({
    memory: { [bc]: a },
  }),
});

testInstruction('LD B, d8', {
  instruction: 0x06,
  duration: 8,
  size: 2,
  effect: ({ pc, memory }) => ({
    b: memory[pc + 1],
  }),
});

testInstruction('LD (a16), SP', {
  instruction: 0x08,
  duration: 20,
  size: 3,
  effect: ({ pc, sp, memory }) => ({
    memory: {
      [memory[pc + 1] + (memory[pc + 2] << 8)]: byte(sp),
      [memory[pc + 1] + (memory[pc + 2] << 8) + 1]: byte(sp >> 8),
    },
  }),
});

testInstruction('LD A, (BC)', {
  instruction: 0x0a,
  duration: 8,
  effect: ({ bc, memory }) => ({
    a: memory[bc],
  }),
});

testInstruction('LD C, d8', {
  instruction: 0x0e,
  duration: 8,
  size: 2,
  effect: ({ pc, memory }) => ({
    c: memory[pc + 1],
  }),
});

testInstruction('LD DE, d16', {
  instruction: 0x11,
  duration: 12,
  size: 3,
  effect: ({ pc, memory }) => ({
    de: word(memory[pc + 1] + (memory[pc + 2] << 8)),
  }),
});

testInstruction('LD (DE), A', {
  instruction: 0x12,
  duration: 8,
  effect: ({ a, de }) => ({
    memory: { [de]: a },
  }),
});

testInstruction('LD D, d8', {
  instruction: 0x16,
  duration: 8,
  size: 2,
  effect: ({ memory, pc }) => ({
    d: memory[pc + 1],
  }),
});

testInstruction('LD E, d8', {
  instruction: 0x1e,
  duration: 8,
  size: 2,
  effect: ({ pc, memory }) => ({
    e: memory[pc + 1],
  }),
});

testInstruction('LD H, d8', {
  instruction: 0x26,
  duration: 8,
  size: 2,
  effect: ({ pc, memory }) => ({
    h: memory[pc + 1],
  }),
});

testInstruction('LD A, (HL+)', {
  instruction: 0x2a,
  duration: 8,
  effect: ({ hl, memory }) => ({
    hl: addWords(hl, 1).result,
    a: memory[hl],
  }),
});

testInstruction('LD L, d8', {
  instruction: 0x2e,
  duration: 8,
  size: 2,
  effect: ({ pc, memory }) => ({
    l: memory[pc + 1],
  }),
});

testInstruction('LD SP, d16', {
  instruction: 0x31,
  duration: 12,
  size: 3,
  effect: ({ pc, memory }) => ({
    sp: word(memory[pc + 1] + (memory[pc + 2] << 8)),
  }),
});

testInstruction('LD (HL-), A', {
  instruction: 0x32,
  duration: 8,
  effect: ({ hl, a }) => ({
    hl: subtractWords(hl, 1).result,
    memory: { [hl]: a },
  }),
});

testInstruction('LD (HL), d8', {
  instruction: 0x36,
  duration: 12,
  size: 2,
  effect: ({ hl, memory, pc }) => ({
    memory: { [hl]: memory[pc + 1] },
  }),
});

testInstruction('LD A, (HL-)', {
  instruction: 0x3a,
  duration: 8,
  effect: ({ hl, memory }) => ({
    hl: subtractWords(hl, 1).result,
    a: memory[hl],
  }),
});

testInstruction('LD A, d8', {
  instruction: 0x3e,
  duration: 8,
  size: 2,
  effect: ({ pc, memory }) => ({
    a: memory[pc + 1],
  }),
});

testInstruction('LD B, (HL)', {
  instruction: 0x46,
  duration: 8,
  effect: ({ hl, memory }) => ({ b: memory[hl] }),
});

testInstruction('LD C, (HL)', {
  instruction: 0x4e,
  duration: 8,
  effect: ({ hl, memory }) => ({ c: memory[hl] }),
});

testInstruction('LD D, (HL)', {
  instruction: 0x56,
  duration: 8,
  effect: ({ hl, memory }) => ({ d: memory[hl] }),
});

testInstruction('LD E, (HL)', {
  instruction: 0x5e,
  duration: 8,
  effect: ({ hl, memory }) => ({ e: memory[hl] }),
});

testInstruction('LD H, (HL)', {
  instruction: 0x66,
  duration: 8,
  effect: ({ hl, memory }) => ({ h: memory[hl] }),
});

testInstruction('LD L, (HL)', {
  instruction: 0x6e,
  duration: 8,
  effect: ({ hl, memory }) => ({ l: memory[hl] }),
});

testInstruction('LD (HL), B', {
  instruction: 0x70,
  duration: 8,
  effect: ({ b, hl }) => ({ memory: { [hl]: b } }),
});

testInstruction('LD (HL), C', {
  instruction: 0x71,
  duration: 8,
  effect: ({ c, hl }) => ({ memory: { [hl]: c } }),
});

testInstruction('LD (HL), D', {
  instruction: 0x72,
  duration: 8,
  effect: ({ d, hl }) => ({ memory: { [hl]: d } }),
});

testInstruction('LD (HL), E', {
  instruction: 0x73,
  duration: 8,
  effect: ({ e, hl }) => ({ memory: { [hl]: e } }),
});

testInstruction('LD (HL), H', {
  instruction: 0x74,
  duration: 8,
  effect: ({ h, hl }) => ({ memory: { [hl]: h } }),
});

testInstruction('LD (HL), L', {
  instruction: 0x75,
  duration: 8,
  effect: ({ l, hl }) => ({ memory: { [hl]: l } }),
});

testInstruction('LD (HL), A', {
  instruction: 0x77,
  duration: 8,
  effect: ({ a, hl }) => ({ memory: { [hl]: a } }),
});

testInstruction('LD A, (HL)', {
  instruction: 0x7e,
  duration: 8,
  effect: ({ hl, memory }) => ({ a: memory[hl] }),
});

testInstruction('LD A, A', {
  instruction: 0x7f,
  duration: 4,
  effect: ({ a }) => ({ a: a }),
});

testInstruction('LD A, (DE)', {
  instruction: 0x1a,
  duration: 8,
  effect: ({ de, memory }) => ({
    a: memory[de],
  }),
});

testInstruction('LD HL, d16', {
  instruction: 0x21,
  duration: 12,
  size: 3,
  effect: ({ pc, memory }) => ({
    hl: word(memory[pc + 1] + (memory[pc + 2] << 8)),
  }),
});

testInstruction('LD (HL+), A', {
  instruction: 0x22,
  duration: 8,
  effect: ({ hl, a }) => ({
    hl: addWords(hl, 1).result,
    memory: { [hl]: a },
  }),
});

testInstruction('LDH (a8), A', {
  instruction: 0xe0,
  duration: 12,
  size: 2,
  effect: ({ a, pc, memory }) => ({
    memory: { [0xff00 + memory[pc + 1]]: a },
  }),
});

testInstruction('LD (C), A', {
  instruction: 0xe2,
  duration: 8,
  effect: ({ a, c }) => ({
    memory: { [0xff00 + c]: a },
  }),
});

testInstruction('LD (a16), A', {
  instruction: 0xea,
  duration: 16,
  size: 3,
  effect: ({ pc, memory, a }) => ({
    memory: { [memory[pc + 1] + (memory[pc + 2] << 8)]: a },
  }),
});

testInstruction('LDH A, (a8)', {
  instruction: 0xf0,
  duration: 12,
  size: 2,
  effect: ({ pc, memory }) => ({
    a: memory[0xff00 + memory[pc + 1]],
  }),
});

testInstruction('LD A, (C)', {
  instruction: 0xf2,
  duration: 8,
  effect: ({ memory, c }) => ({
    a: memory[0xff00 + c],
  }),
});

testInstruction('LD HL, SP + r8', {
  instruction: 0xf8,
  duration: 12,
  size: 2,
  effect: ({ pc, sp, memory }) => ({
    hl: addSignedOffset(sp, memory[pc + 1]).result,
    flags: {
      z: 0,
      n: 0,
      h: addSignedOffset(sp, memory[pc + 1]).h,
      c: addSignedOffset(sp, memory[pc + 1]).c,
    },
  }),
});

testInstruction('LD A, (a16)', {
  instruction: 0xfa,
  duration: 16,
  size: 3,
  effect: ({ pc, memory }) => ({
    a: memory[memory[pc + 1] + (memory[pc + 2] << 8)],
  }),
});
