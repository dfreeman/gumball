import testInstruction from '#tests/helpers/test-instruction';

testInstruction('LD B, B', {
  instruction: 0x40,
  duration: 4,
  effect: ({ b }) => ({ b: b }),
});

testInstruction('LD B, C', {
  instruction: 0x41,
  duration: 4,
  effect: ({ c }) => ({ b: c }),
});

testInstruction('LD B, D', {
  instruction: 0x42,
  duration: 4,
  effect: ({ d }) => ({ b: d }),
});

testInstruction('LD B, E', {
  instruction: 0x43,
  duration: 4,
  effect: ({ e }) => ({ b: e }),
});

testInstruction('LD B, H', {
  instruction: 0x44,
  duration: 4,
  effect: ({ h }) => ({ b: h }),
});

testInstruction('LD B, L', {
  instruction: 0x45,
  duration: 4,
  effect: ({ l }) => ({ b: l }),
});

testInstruction('LD B, A', {
  instruction: 0x47,
  duration: 4,
  effect: ({ a }) => ({ b: a }),
});

testInstruction('LD C, B', {
  instruction: 0x48,
  duration: 4,
  effect: ({ b }) => ({ c: b }),
});

testInstruction('LD C, C', {
  instruction: 0x49,
  duration: 4,
  effect: ({ c }) => ({ c: c }),
});

testInstruction('LD C, D', {
  instruction: 0x4a,
  duration: 4,
  effect: ({ d }) => ({ c: d }),
});

testInstruction('LD C, E', {
  instruction: 0x4b,
  duration: 4,
  effect: ({ e }) => ({ c: e }),
});

testInstruction('LD C, H', {
  instruction: 0x4c,
  duration: 4,
  effect: ({ h }) => ({ c: h }),
});

testInstruction('LD C, L', {
  instruction: 0x4d,
  duration: 4,
  effect: ({ l }) => ({ c: l }),
});

testInstruction('LD C, A', {
  instruction: 0x4f,
  duration: 4,
  effect: ({ a }) => ({ c: a }),
});

testInstruction('LD D, B', {
  instruction: 0x50,
  duration: 4,
  effect: ({ b }) => ({ d: b }),
});

testInstruction('LD D, C', {
  instruction: 0x51,
  duration: 4,
  effect: ({ c }) => ({ d: c }),
});

testInstruction('LD D, D', {
  instruction: 0x52,
  duration: 4,
  effect: ({ d }) => ({ d: d }),
});

testInstruction('LD D, E', {
  instruction: 0x53,
  duration: 4,
  effect: ({ e }) => ({ d: e }),
});

testInstruction('LD D, H', {
  instruction: 0x54,
  duration: 4,
  effect: ({ h }) => ({ d: h }),
});

testInstruction('LD D, L', {
  instruction: 0x55,
  duration: 4,
  effect: ({ l }) => ({ d: l }),
});

testInstruction('LD D, A', {
  instruction: 0x57,
  duration: 4,
  effect: ({ a }) => ({ d: a }),
});

testInstruction('LD E, B', {
  instruction: 0x58,
  duration: 4,
  effect: ({ b }) => ({ e: b }),
});

testInstruction('LD E, C', {
  instruction: 0x59,
  duration: 4,
  effect: ({ c }) => ({ e: c }),
});

testInstruction('LD E, D', {
  instruction: 0x5a,
  duration: 4,
  effect: ({ d }) => ({ e: d }),
});

testInstruction('LD E, E', {
  instruction: 0x5b,
  duration: 4,
  effect: ({ e }) => ({ e: e }),
});

testInstruction('LD E, H', {
  instruction: 0x5c,
  duration: 4,
  effect: ({ h }) => ({ e: h }),
});

testInstruction('LD E, L', {
  instruction: 0x5d,
  duration: 4,
  effect: ({ l }) => ({ e: l }),
});

testInstruction('LD E, A', {
  instruction: 0x5f,
  duration: 4,
  effect: ({ a }) => ({ e: a }),
});

testInstruction('LD H, B', {
  instruction: 0x60,
  duration: 4,
  effect: ({ b }) => ({ h: b }),
});

testInstruction('LD H, C', {
  instruction: 0x61,
  duration: 4,
  effect: ({ c }) => ({ h: c }),
});

testInstruction('LD H, D', {
  instruction: 0x62,
  duration: 4,
  effect: ({ d }) => ({ h: d }),
});

testInstruction('LD H, E', {
  instruction: 0x63,
  duration: 4,
  effect: ({ e }) => ({ h: e }),
});

testInstruction('LD H, H', {
  instruction: 0x64,
  duration: 4,
  effect: ({ h }) => ({ h: h }),
});

testInstruction('LD H, L', {
  instruction: 0x65,
  duration: 4,
  effect: ({ l }) => ({ h: l }),
});

testInstruction('LD H, A', {
  instruction: 0x67,
  duration: 4,
  effect: ({ a }) => ({ h: a }),
});

testInstruction('LD L, B', {
  instruction: 0x68,
  duration: 4,
  effect: ({ b }) => ({ l: b }),
});

testInstruction('LD L, C', {
  instruction: 0x69,
  duration: 4,
  effect: ({ c }) => ({ l: c }),
});

testInstruction('LD L, D', {
  instruction: 0x6a,
  duration: 4,
  effect: ({ d }) => ({ l: d }),
});

testInstruction('LD L, E', {
  instruction: 0x6b,
  duration: 4,
  effect: ({ e }) => ({ l: e }),
});

testInstruction('LD L, H', {
  instruction: 0x6c,
  duration: 4,
  effect: ({ h }) => ({ l: h }),
});

testInstruction('LD L, L', {
  instruction: 0x6d,
  duration: 4,
  effect: ({ l }) => ({ l: l }),
});

testInstruction('LD L, A', {
  instruction: 0x6f,
  duration: 4,
  effect: ({ a }) => ({ l: a }),
});

testInstruction('LD A, B', {
  instruction: 0x78,
  duration: 4,
  effect: ({ b }) => ({ a: b }),
});

testInstruction('LD A, C', {
  instruction: 0x79,
  duration: 4,
  effect: ({ c }) => ({ a: c }),
});

testInstruction('LD A, D', {
  instruction: 0x7a,
  duration: 4,
  effect: ({ d }) => ({ a: d }),
});

testInstruction('LD A, E', {
  instruction: 0x7b,
  duration: 4,
  effect: ({ e }) => ({ a: e }),
});

testInstruction('LD A, H', {
  instruction: 0x7c,
  duration: 4,
  effect: ({ h }) => ({ a: h }),
});

testInstruction('LD A, L', {
  instruction: 0x7d,
  duration: 4,
  effect: ({ l }) => ({ a: l }),
});

testInstruction('LD SP, HL', {
  instruction: 0xf9,
  duration: 8,
  effect: ({ hl }) => ({
    sp: hl,
  }),
});
