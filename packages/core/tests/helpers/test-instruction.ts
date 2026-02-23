import { describe, test, expect } from 'vitest';
import CPU from '../../src/cpu';
import { Registers, ByteRegister, WordRegister, Flags, Flag } from '../../src/cpu/registers';
import { Byte, word, Word, byte } from '../../src/utils/sized-numbers';
import DataSource from '../../src/data-source';

type MemoryState = Record<number, Byte>;
type RegisterState = Pick<Registers, ByteRegister | WordRegister>;
type FlagState = Pick<Flags, Flag>;
type State = RegisterState & { memory: MemoryState; flags: FlagState };
type PartialState = {
  [K in keyof State]?: K extends 'flags' ? Partial<State[K]> : State[K];
};

type TestInstructionOptions = {
  instruction: number | Array<number>;
  duration: number | ((flags: Flags) => number);
  size?: number;
  effect?(start: State): PartialState;
  before?(cpu: CPU): void;
  after?(cpu: CPU): void;
};

/**
 * A utility that sets up a series of tests for a particular CPU
 * instruction, exercising it with memory and registers initialized
 * to a number of different patterns of bits.
 */
export default function testInstruction(name: string, options: TestInstructionOptions): void {
  let {
    instruction,
    duration,
    before,
    after,
    size = Array.isArray(options.instruction) ? options.instruction.length : 1,
    effect = (): PartialState => ({}),
  } = options;

  describe(name, () => {
    for (let [caseName, initializeWord] of cases) {
      test(caseName, () => {
        let memory = seededDataSource(typeof instruction === 'number' ? [instruction] : instruction, initializeWord);
        let cpu = new CPU(memory);
        let registers = cpu['registers'];

        registers.af = initializeWord();
        registers.bc = initializeWord();
        registers.de = initializeWord();
        registers.hl = initializeWord();
        registers.sp = initializeWord();
        registers.pc = 0;

        if (before) {
          before(cpu);
        }

        let expectedDuration = typeof duration === 'function' ? duration(cpu['flags']) : duration;
        let initialRegisters = registers.clone();
        let actualDuration = cpu.step();

        let initialMemory = memory.initialState();
        let expectedResult = {
          pc: word(initialRegisters.pc + size),
          ...effect(getState(initialRegisters, initialMemory)),
        };

        let expectedRegisters = applyStateToRegisters(initialRegisters, expectedResult);
        let expectedState = getState(expectedRegisters, initialMemory, expectedResult.memory);

        expect(actualDuration).toBe(expectedDuration);
        expect(getState(cpu['registers'], memory.currentState())).toEqual(expectedState);

        if (after) {
          after(cpu);
        }
      });
    }
  });
}

const cases: Array<[string, () => Word]> = [
  ['0x0000 Seed', () => 0],
  ['0xffff Seed', () => 0xffff],
  ['0x8080 Seed', () => 0x8080 as Word],
  ['0x0101 Seed', () => 0x0101 as Word],
  ['Random Seed', randomWord],
];

const wordRegisters: Array<WordRegister> = ['af', 'bc', 'de', 'hl', 'sp', 'pc'];
const byteRegisters: Array<ByteRegister> = ['a', 'b', 'c', 'd', 'e', 'h', 'l'];
const flags: Array<Flag> = ['z', 'n', 'h', 'c'];

function randomWord(): Word {
  return word(Math.floor(Math.random() * 0xffff));
}

function applyStateToRegisters(registers: Registers, state?: PartialState): Registers {
  if (!state) {
    return registers;
  }

  for (let register of byteRegisters) {
    if (register in state) {
      registers[register] = state[register] || 0;
    }
  }

  for (let register of wordRegisters) {
    if (register in state) {
      registers[register] = state[register] || 0;
    }
  }

  if (state.flags) {
    for (let flag of flags) {
      if (flag in state.flags) {
        registers.f[flag] = state.flags[flag] || 0;
      }
    }
  }

  return registers;
}

function getState(registers: Registers, baseMemory: MemoryState, memoryOverrides?: MemoryState): State {
  let { a, b, c, d, e, h, l, af, bc, de, hl, sp, pc, f } = registers;
  let flags = { z: f.z, n: f.n, h: f.h, c: f.c };
  let memory = Object.assign({}, baseMemory, memoryOverrides);
  return { a, b, c, d, e, h, l, af, bc, de, hl, sp, pc, flags, memory };
}

type SeededDataSource = DataSource & { currentState(): MemoryState; initialState(): MemoryState };
function seededDataSource(initial: Array<number>, seed: () => number): SeededDataSource {
  let initialMemory = new Map<number, Byte>(initial.map((value, i) => [i, byte(value)]));
  let currentMemory = new Map(initialMemory.entries());

  return {
    currentState(): MemoryState {
      let result: MemoryState = {};
      for (let [index, value] of currentMemory.entries()) {
        result[index] = value;
      }
      return result;
    },

    initialState(): MemoryState {
      let result: MemoryState = {};
      for (let [index, value] of initialMemory.entries()) {
        result[index] = value;
      }
      return result;
    },

    readByte(address: number): Byte {
      let value = currentMemory.get(address);
      if (value === undefined) {
        value = byte(seed());
        initialMemory.set(address, value);
        currentMemory.set(address, value);
      }
      return value;
    },

    writeByte(address: number, value: Byte) {
      currentMemory.set(address, value);
    },
  };
}
