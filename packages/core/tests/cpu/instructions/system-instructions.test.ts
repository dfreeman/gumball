import { expect } from 'vitest';
import testInstruction from '../../helpers/test-instruction';

testInstruction('NOP', {
  duration: 4,
  instruction: 0x00,
});

testInstruction('STOP', {
  instruction: 0x10,
  duration: 4,
  after(cpu) {
    expect(cpu.isStopped).toBe(true);
  },
});
