import DataSource from '../data-source';
import { bit, byte, word, Bit, Byte, Word } from '../utils/sized-numbers';
import { Registers, ByteRegister, WordRegister, Flag } from './registers';
import {
  addBytes,
  subtractBytes,
  addWords,
  readWord,
  writeWord,
  rotateLeft,
  rotateRight,
  signedByte,
  decimalAdjust,
  addBytesCarry,
  subtractBytesCarry,
  addSignedOffset,
  shiftLeftA,
  shiftRightA,
  shiftRightL,
  swap,
} from '../utils/data';
import { table } from 'table';
import chalk from 'chalk';
import { label, value, atom, tables } from '../utils/debug';

/**
 * The duration in system clock ticks of an instruction.
 * Note that all durations are a multiple of 4, and some
 * resources refer to "machine cycles" instead, which
 * correspond 1:4 to ticks of the system clock. Based on
 * which system is in use, the DMG is referred to as having
 * either a 1MHz or 4Mhz CPU.
 */
export type Duration = 4 | 8 | 12 | 16 | 20 | 24;

/**
 * The current state of the system. `Running` refers to
 * the normal mode of operation, while `Halted` is a lower-
 * power state that pauses execution until an interrupt
 * is triggerd. `Stopped` is a "very" low power state that
 * ceases all system activity until user input is received.
 */
export enum State {
  Stopped,
  Halted,
  Running,
}

/**
 * The `ei` instruction actually takes effect after the
 * following instruction is executed, so an `ei` followed
 * immediately by a `di` would not allow any interrupts
 * to be serviced.
 *
 * https://gbdev.io/pandocs/#interrupts
 */
export enum Interrupts {
  Disabled,
  Enabling,
  Enabled,
}

class Instruction {
  public constructor(
    private opcode: number,
    private name: string,
    public readonly invoke: (cpu: CPU) => Duration,
  ) {}

  public toString(): string {
    return `Instruction 0x${this.opcode.toString(16).padStart(2, '0')} (${this.name})`;
  }
}

function instr(opcode: number, name: string, invoke: (cpu: CPU) => Duration): Instruction {
  return new Instruction(opcode, name, invoke);
}

export default class CPU {
  public readonly registers = new Registers();
  public readonly flags = this.registers.f;

  private state: State = State.Running;

  /** [Interrupt Master Enable flag](https://gbdev.io/pandocs/Interrupts.html#ime-interrupt-master-enable-flag-write-only) */
  private ime = Interrupts.Disabled;

  public constructor(private memory: DataSource) {}

  /**
   * Indicates that the CPU is currently in the running state and ready
   * to process further instructions. See also `isHalted` and `isStopped`.
   */
  public get isRunning(): boolean {
    return this.state === State.Running;
  }

  /**
   * When the HALT instruction is executed, the system clock is disabled and
   * the CPU halts. However, operations that don't require the system clock
   * (from the official manual: 'e.g. DIV, SIO, timer, LCD controller and
   * sound circuit') continue to operate.
   *
   * A halt is canceled whenever an enabled interrupt is triggered. After
   * the interrupt is serviced, execution will resume from the next
   * instruction following the HALT.
   */
  public get isHalted(): boolean {
    return this.state === State.Halted;
  }

  /**
   * When the STOP instruction is executed, the system enters a "very low
   * power mode" and all operation except for the SI0 external clock is
   * stopped.
   *
   * A stop is canceled when terminal P10, P11, P12 or P13 receives a LOW
   * signal (i.e. a gamepad button is pressed), and execution resumes at
   * the instruction following the STOP.
   */
  public get isStopped(): boolean {
    return this.state === State.Stopped;
  }

  /**
   * Whether the Interrupt Master Enable flag is set, allowing interrupts
   * to (potentially) be serviced, depending on the bits of the IE flag
   * that are set in memory at `0xffff`.
   */
  public get interruptsEnabled(): boolean {
    return this.ime === Interrupts.Enabled;
  }

  /**
   * Executes the instruction queued up at the address in `pc`, returning
   * the number of clock ticks consumed. If the CPU is currently halted
   * or stopped, does nothing and consumes no time.
   */
  public step(): number {
    if (!this.isRunning) return 0;

    let previousIME = this.ime;
    let opcode = this.memory.readByte(this.registers.pc);
    let instruction = CPU.instructions[opcode];

    this.incrementPC();

    let duration = instruction.invoke(this);
    if (previousIME === Interrupts.Enabling && this.ime === Interrupts.Enabling) {
      this.ime = Interrupts.Enabled;
    }

    return duration;
  }

  public inspect(): string {
    let { a, f, b, c, d, e, h, l, sp, pc, af, bc, de, hl } = this.registers;
    let flags = FLAG_NAMES.map((flag) => chalk[f[flag] ? 'bold' : 'gray'](flag)).join('');

    return tables({
      'CPU Registers': [
        [label.word('af'), value(af, 4), label.byte('a'), value(a), label.byte('f'), flags],
        [label.word('bc'), value(bc, 4), label.byte('b'), value(b), label.byte('c'), value(c)],
        [label.word('de'), value(de, 4), label.byte('d'), value(d), label.byte('e'), value(e)],
        [label.word('hl'), value(hl, 4), label.byte('h'), value(h), label.byte('l'), value(l)],
      ],
      Memory: [
        [label.word('sp'), value(sp, 4), value(readWord(this.memory, sp), 4)],
        [label.word('pc'), value(pc, 4), atom(CPU.instructions[this.memory.readByte(pc)])],
      ],
    });
  }

  /**
   * CPU Instructions
   *
   * https://gbdev.github.io/gb-opcodes/optables/
   */
  private static instructions: Array<Instruction> = [
    instr(0x00, 'NOP', () => 4),
    instr(0x01, 'LD BC, d16', (cpu) => cpu.load16RI('bc', cpu.consumeWordAtPC())),
    instr(0x02, 'LD (BC), A', (cpu) => cpu.load8MR('bc', 'a')),
    instr(0x03, 'INC BC', (cpu) => cpu.inc16R('bc')),
    instr(0x04, 'INC B', (cpu) => cpu.inc8R('b')),
    instr(0x05, 'DEC B', (cpu) => cpu.dec8R('b')),
    instr(0x06, 'LD B, d8', (cpu) => cpu.load8RI('b', cpu.consumeByteAtPC())),
    instr(0x07, 'RLCA', (cpu) => cpu.rotateLeftCarryA()),
    instr(0x08, 'LD (a16), SP', (cpu) => cpu.load16MR(cpu.consumeWordAtPC(), 'sp')),
    instr(0x09, 'ADD HL, BC', (cpu) => cpu.add16RR('hl', 'bc')),
    instr(0x0a, 'LD A, (BC)', (cpu) => cpu.load8RM('a', 'bc')),
    instr(0x0b, 'DEC BC', (cpu) => cpu.dec16R('bc')),
    instr(0x0c, 'INC C', (cpu) => cpu.inc8R('c')),
    instr(0x0d, 'DEC C', (cpu) => cpu.dec8R('c')),
    instr(0x0e, 'LD C, d8', (cpu) => cpu.load8RI('c', cpu.consumeByteAtPC())),
    instr(0x0f, 'RRCA', (cpu) => cpu.rotateRightCarryA()),
    instr(0x10, 'STOP', (cpu) => cpu.stop()),
    instr(0x11, 'LD DE, d16', (cpu) => cpu.load16RI('de', cpu.consumeWordAtPC())),
    instr(0x12, 'LD (DE), A', (cpu) => cpu.load8MR('de', 'a')),
    instr(0x13, 'INC DE', (cpu) => cpu.inc16R('de')),
    instr(0x14, 'INC D', (cpu) => cpu.inc8R('d')),
    instr(0x15, 'DEC D', (cpu) => cpu.dec8R('d')),
    instr(0x16, 'LD D, d8', (cpu) => cpu.load8RI('d', cpu.consumeByteAtPC())),
    instr(0x17, 'RLA', (cpu) => cpu.rotateLeftA()),
    instr(0x18, 'JR r8', (cpu) => cpu.jumpRelative(cpu.consumeByteAtPC())),
    instr(0x19, 'ADD HL, DE', (cpu) => cpu.add16RR('hl', 'de')),
    instr(0x1a, 'LD A, (DE)', (cpu) => cpu.load8RM('a', 'de')),
    instr(0x1b, 'DEC DE', (cpu) => cpu.dec16R('de')),
    instr(0x1c, 'INC E', (cpu) => cpu.inc8R('e')),
    instr(0x1d, 'DEC E', (cpu) => cpu.dec8R('e')),
    instr(0x1e, 'LD E, d8', (cpu) => cpu.load8RI('e', cpu.consumeByteAtPC())),
    instr(0x1f, 'RRA', (cpu) => cpu.rotateRightA()),
    instr(0x20, 'JR NZ, r8', (cpu) => cpu.jumpRelativeUnless(cpu.consumeByteAtPC(), 'z')),
    instr(0x21, 'LD HL, d16', (cpu) => cpu.load16RI('hl', cpu.consumeWordAtPC())),
    instr(0x22, 'LD (HL+), A', (cpu) => cpu.load8MR('hl', 'a', 1)),
    instr(0x23, 'INC HL', (cpu) => cpu.inc16R('hl')),
    instr(0x24, 'INC H', (cpu) => cpu.inc8R('h')),
    instr(0x25, 'DEC H', (cpu) => cpu.dec8R('h')),
    instr(0x26, 'LD H, d8', (cpu) => cpu.load8RI('h', cpu.consumeByteAtPC())),
    instr(0x27, 'DAA', (cpu) => cpu.daa()),
    instr(0x28, 'JR Z, r8', (cpu) => cpu.jumpRelativeIf(cpu.consumeByteAtPC(), 'z')),
    instr(0x29, 'ADD HL, HL', (cpu) => cpu.add16RR('hl', 'hl')),
    instr(0x2a, 'LD A, (HL+)', (cpu) => cpu.load8RM('a', 'hl', 1)),
    instr(0x2b, 'DEC HL', (cpu) => cpu.dec16R('hl')),
    instr(0x2c, 'INC L', (cpu) => cpu.inc8R('l')),
    instr(0x2d, 'DEC L', (cpu) => cpu.dec8R('l')),
    instr(0x2e, 'LD L, d8', (cpu) => cpu.load8RI('l', cpu.consumeByteAtPC())),
    instr(0x2f, 'CPL', (cpu) => cpu.cpl()),
    instr(0x30, 'JR NC, r8', (cpu) => cpu.jumpRelativeUnless(cpu.consumeByteAtPC(), 'c')),
    instr(0x31, 'LD SP, d16', (cpu) => cpu.load16RI('sp', cpu.consumeWordAtPC())),
    instr(0x32, 'LD (HL-), A', (cpu) => cpu.load8MR('hl', 'a', -1)),
    instr(0x33, 'INC SP', (cpu) => cpu.inc16R('sp')),
    instr(0x34, 'INC (HL)', (cpu) => cpu.inc8M('hl')),
    instr(0x35, 'DEC (HL)', (cpu) => cpu.dec8M('hl')),
    instr(0x36, 'LD (HL), d8', (cpu) => cpu.load8MI('hl', cpu.consumeByteAtPC())),
    instr(0x37, 'SCF', (cpu) => cpu.setCarryFlag(1)),
    instr(0x38, 'JR C, r8', (cpu) => cpu.jumpRelativeIf(cpu.consumeByteAtPC(), 'c')),
    instr(0x39, 'ADD HL, SP', (cpu) => cpu.add16RR('hl', 'sp')),
    instr(0x3a, 'LD A, (HL-)', (cpu) => cpu.load8RM('a', 'hl', -1)),
    instr(0x3b, 'DEC SP', (cpu) => cpu.dec16R('sp')),
    instr(0x3c, 'INC A', (cpu) => cpu.inc8R('a')),
    instr(0x3d, 'DEC A', (cpu) => cpu.dec8R('a')),
    instr(0x3e, 'LD A, d8', (cpu) => cpu.load8RI('a', cpu.consumeByteAtPC())),
    instr(0x3f, 'CCF', (cpu) => cpu.setCarryFlag(bit(!cpu.flags.c))),
    instr(0x40, 'LD B, B', (cpu) => cpu.load8RR('b', 'b')),
    instr(0x41, 'LD B, C', (cpu) => cpu.load8RR('b', 'c')),
    instr(0x42, 'LD B, D', (cpu) => cpu.load8RR('b', 'd')),
    instr(0x43, 'LD B, E', (cpu) => cpu.load8RR('b', 'e')),
    instr(0x44, 'LD B, H', (cpu) => cpu.load8RR('b', 'h')),
    instr(0x45, 'LD B, L', (cpu) => cpu.load8RR('b', 'l')),
    instr(0x46, 'LD B, (HL)', (cpu) => cpu.load8RM('b', 'hl')),
    instr(0x47, 'LD B, A', (cpu) => cpu.load8RR('b', 'a')),
    instr(0x48, 'LD C, B', (cpu) => cpu.load8RR('c', 'b')),
    instr(0x49, 'LD C, C', (cpu) => cpu.load8RR('c', 'c')),
    instr(0x4a, 'LD C, D', (cpu) => cpu.load8RR('c', 'd')),
    instr(0x4b, 'LD C, E', (cpu) => cpu.load8RR('c', 'e')),
    instr(0x4c, 'LD C, H', (cpu) => cpu.load8RR('c', 'h')),
    instr(0x4d, 'LD C, L', (cpu) => cpu.load8RR('c', 'l')),
    instr(0x4e, 'LD C, (HL)', (cpu) => cpu.load8RM('c', 'hl')),
    instr(0x4f, 'LD C, A', (cpu) => cpu.load8RR('c', 'a')),
    instr(0x50, 'LD D, B', (cpu) => cpu.load8RR('d', 'b')),
    instr(0x51, 'LD D, C', (cpu) => cpu.load8RR('d', 'c')),
    instr(0x52, 'LD D, D', (cpu) => cpu.load8RR('d', 'd')),
    instr(0x53, 'LD D, E', (cpu) => cpu.load8RR('d', 'e')),
    instr(0x54, 'LD D, H', (cpu) => cpu.load8RR('d', 'h')),
    instr(0x55, 'LD D, L', (cpu) => cpu.load8RR('d', 'l')),
    instr(0x56, 'LD D, (HL)', (cpu) => cpu.load8RM('d', 'hl')),
    instr(0x57, 'LD D, A', (cpu) => cpu.load8RR('d', 'a')),
    instr(0x58, 'LD E, B', (cpu) => cpu.load8RR('e', 'b')),
    instr(0x59, 'LD E, C', (cpu) => cpu.load8RR('e', 'c')),
    instr(0x5a, 'LD E, D', (cpu) => cpu.load8RR('e', 'd')),
    instr(0x5b, 'LD E, E', (cpu) => cpu.load8RR('e', 'e')),
    instr(0x5c, 'LD E, H', (cpu) => cpu.load8RR('e', 'h')),
    instr(0x5d, 'LD E, L', (cpu) => cpu.load8RR('e', 'l')),
    instr(0x5e, 'LD E, (HL)', (cpu) => cpu.load8RM('e', 'hl')),
    instr(0x5f, 'LD E, A', (cpu) => cpu.load8RR('e', 'a')),
    instr(0x60, 'LD H, B', (cpu) => cpu.load8RR('h', 'b')),
    instr(0x61, 'LD H, C', (cpu) => cpu.load8RR('h', 'c')),
    instr(0x62, 'LD H, D', (cpu) => cpu.load8RR('h', 'd')),
    instr(0x63, 'LD H, E', (cpu) => cpu.load8RR('h', 'e')),
    instr(0x64, 'LD H, H', (cpu) => cpu.load8RR('h', 'h')),
    instr(0x65, 'LD H, L', (cpu) => cpu.load8RR('h', 'l')),
    instr(0x66, 'LD H, (HL)', (cpu) => cpu.load8RM('h', 'hl')),
    instr(0x67, 'LD H, A', (cpu) => cpu.load8RR('h', 'a')),
    instr(0x68, 'LD L, B', (cpu) => cpu.load8RR('l', 'b')),
    instr(0x69, 'LD L, C', (cpu) => cpu.load8RR('l', 'c')),
    instr(0x6a, 'LD L, D', (cpu) => cpu.load8RR('l', 'd')),
    instr(0x6b, 'LD L, E', (cpu) => cpu.load8RR('l', 'e')),
    instr(0x6c, 'LD L, H', (cpu) => cpu.load8RR('l', 'h')),
    instr(0x6d, 'LD L, L', (cpu) => cpu.load8RR('l', 'l')),
    instr(0x6e, 'LD L, (HL)', (cpu) => cpu.load8RM('l', 'hl')),
    instr(0x6f, 'LD L, A', (cpu) => cpu.load8RR('l', 'a')),
    instr(0x70, 'LD (HL), B', (cpu) => cpu.load8MR('hl', 'b')),
    instr(0x71, 'LD (HL), C', (cpu) => cpu.load8MR('hl', 'c')),
    instr(0x72, 'LD (HL), D', (cpu) => cpu.load8MR('hl', 'd')),
    instr(0x73, 'LD (HL), E', (cpu) => cpu.load8MR('hl', 'e')),
    instr(0x74, 'LD (HL), H', (cpu) => cpu.load8MR('hl', 'h')),
    instr(0x75, 'LD (HL), L', (cpu) => cpu.load8MR('hl', 'l')),
    instr(0x76, 'HALT', (cpu) => cpu.halt()),
    instr(0x77, 'LD (HL), A', (cpu) => cpu.load8MR('hl', 'a')),
    instr(0x78, 'LD A, B', (cpu) => cpu.load8RR('a', 'b')),
    instr(0x79, 'LD A, C', (cpu) => cpu.load8RR('a', 'c')),
    instr(0x7a, 'LD A, D', (cpu) => cpu.load8RR('a', 'd')),
    instr(0x7b, 'LD A, E', (cpu) => cpu.load8RR('a', 'e')),
    instr(0x7c, 'LD A, H', (cpu) => cpu.load8RR('a', 'h')),
    instr(0x7d, 'LD A, L', (cpu) => cpu.load8RR('a', 'l')),
    instr(0x7e, 'LD A, (HL)', (cpu) => cpu.load8RM('a', 'hl')),
    instr(0x7f, 'LD A, A', (cpu) => cpu.load8RR('a', 'a')),
    instr(0x80, 'ADD A, B', (cpu) => cpu.add8RR('a', 'b')),
    instr(0x81, 'ADD A, C', (cpu) => cpu.add8RR('a', 'c')),
    instr(0x82, 'ADD A, D', (cpu) => cpu.add8RR('a', 'd')),
    instr(0x83, 'ADD A, E', (cpu) => cpu.add8RR('a', 'e')),
    instr(0x84, 'ADD A, H', (cpu) => cpu.add8RR('a', 'h')),
    instr(0x85, 'ADD A, L', (cpu) => cpu.add8RR('a', 'l')),
    instr(0x86, 'ADD A, (HL)', (cpu) => cpu.add8RM('a', 'hl')),
    instr(0x87, 'ADD A, A', (cpu) => cpu.add8RR('a', 'a')),
    instr(0x88, 'ADC A, B', (cpu) => cpu.add8RRCarry('a', 'b')),
    instr(0x89, 'ADC A, C', (cpu) => cpu.add8RRCarry('a', 'c')),
    instr(0x8a, 'ADC A, D', (cpu) => cpu.add8RRCarry('a', 'd')),
    instr(0x8b, 'ADC A, E', (cpu) => cpu.add8RRCarry('a', 'e')),
    instr(0x8c, 'ADC A, H', (cpu) => cpu.add8RRCarry('a', 'h')),
    instr(0x8d, 'ADC A, L', (cpu) => cpu.add8RRCarry('a', 'l')),
    instr(0x8e, 'ADC A, (HL)', (cpu) => cpu.add8RMCarry('a', 'hl')),
    instr(0x8f, 'ADC A, A', (cpu) => cpu.add8RRCarry('a', 'a')),
    instr(0x90, 'SUB B', (cpu) => cpu.subtract8RR('a', 'b')),
    instr(0x91, 'SUB C', (cpu) => cpu.subtract8RR('a', 'c')),
    instr(0x92, 'SUB D', (cpu) => cpu.subtract8RR('a', 'd')),
    instr(0x93, 'SUB E', (cpu) => cpu.subtract8RR('a', 'e')),
    instr(0x94, 'SUB H', (cpu) => cpu.subtract8RR('a', 'h')),
    instr(0x95, 'SUB L', (cpu) => cpu.subtract8RR('a', 'l')),
    instr(0x96, 'SUB (HL)', (cpu) => cpu.subtract8RM('a', 'hl')),
    instr(0x97, 'SUB A', (cpu) => cpu.subtract8RR('a', 'a')),
    instr(0x98, 'SBC A, B', (cpu) => cpu.subtract8RRCarry('a', 'b')),
    instr(0x99, 'SBC A, C', (cpu) => cpu.subtract8RRCarry('a', 'c')),
    instr(0x9a, 'SBC A, D', (cpu) => cpu.subtract8RRCarry('a', 'd')),
    instr(0x9b, 'SBC A, E', (cpu) => cpu.subtract8RRCarry('a', 'e')),
    instr(0x9c, 'SBC A, H', (cpu) => cpu.subtract8RRCarry('a', 'h')),
    instr(0x9d, 'SBC A, L', (cpu) => cpu.subtract8RRCarry('a', 'l')),
    instr(0x9e, 'SBC A, (HL)', (cpu) => cpu.subtract8RMCarry('a', 'hl')),
    instr(0x9f, 'SBC A, A', (cpu) => cpu.subtract8RRCarry('a', 'a')),
    instr(0xa0, 'AND B', (cpu) => cpu.and8RR('a', 'b')),
    instr(0xa1, 'AND C', (cpu) => cpu.and8RR('a', 'c')),
    instr(0xa2, 'AND D', (cpu) => cpu.and8RR('a', 'd')),
    instr(0xa3, 'AND E', (cpu) => cpu.and8RR('a', 'e')),
    instr(0xa4, 'AND H', (cpu) => cpu.and8RR('a', 'h')),
    instr(0xa5, 'AND L', (cpu) => cpu.and8RR('a', 'l')),
    instr(0xa6, 'AND (HL)', (cpu) => cpu.and8RM('a', 'hl')),
    instr(0xa7, 'AND A', (cpu) => cpu.and8RR('a', 'a')),
    instr(0xa8, 'XOR B', (cpu) => cpu.xor8RR('a', 'b')),
    instr(0xa9, 'XOR C', (cpu) => cpu.xor8RR('a', 'c')),
    instr(0xaa, 'XOR D', (cpu) => cpu.xor8RR('a', 'd')),
    instr(0xab, 'XOR E', (cpu) => cpu.xor8RR('a', 'e')),
    instr(0xac, 'XOR H', (cpu) => cpu.xor8RR('a', 'h')),
    instr(0xad, 'XOR L', (cpu) => cpu.xor8RR('a', 'l')),
    instr(0xae, 'XOR (HL)', (cpu) => cpu.xor8RM('a', 'hl')),
    instr(0xaf, 'XOR A', (cpu) => cpu.xor8RR('a', 'a')),
    instr(0xb0, 'OR B', (cpu) => cpu.or8RR('a', 'b')),
    instr(0xb1, 'OR C', (cpu) => cpu.or8RR('a', 'c')),
    instr(0xb2, 'OR D', (cpu) => cpu.or8RR('a', 'd')),
    instr(0xb3, 'OR E', (cpu) => cpu.or8RR('a', 'e')),
    instr(0xb4, 'OR H', (cpu) => cpu.or8RR('a', 'h')),
    instr(0xb5, 'OR L', (cpu) => cpu.or8RR('a', 'l')),
    instr(0xb6, 'OR (HL)', (cpu) => cpu.or8RM('a', 'hl')),
    instr(0xb7, 'OR A', (cpu) => cpu.or8RR('a', 'a')),
    instr(0xb8, 'CP B', (cpu) => cpu.compare8RR('a', 'b')),
    instr(0xb9, 'CP C', (cpu) => cpu.compare8RR('a', 'c')),
    instr(0xba, 'CP D', (cpu) => cpu.compare8RR('a', 'd')),
    instr(0xbb, 'CP E', (cpu) => cpu.compare8RR('a', 'e')),
    instr(0xbc, 'CP H', (cpu) => cpu.compare8RR('a', 'h')),
    instr(0xbd, 'CP L', (cpu) => cpu.compare8RR('a', 'l')),
    instr(0xbe, 'CP (HL)', (cpu) => cpu.compare8RM('a', 'hl')),
    instr(0xbf, 'CP A', (cpu) => cpu.compare8RR('a', 'a')),
    instr(0xc0, 'RET NZ', (cpu) => cpu.retUnless('z')),
    instr(0xc1, 'POP BC', (cpu) => cpu.pop('bc')),
    instr(0xc2, 'JP NZ, a16', (cpu) => cpu.jumpUnless(cpu.consumeWordAtPC(), 'z')),
    instr(0xc3, 'JP a16', (cpu) => cpu.jump(cpu.consumeWordAtPC())),
    instr(0xc4, 'CALL NZ, a16', (cpu) => cpu.callUnless(cpu.consumeWordAtPC(), 'z')),
    instr(0xc5, 'PUSH BC', (cpu) => cpu.push('bc')),
    instr(0xc6, 'ADD A, d8', (cpu) => cpu.add8RI('a', cpu.consumeByteAtPC())),
    instr(0xc7, 'RST 00H', (cpu) => cpu.rst(0)),
    instr(0xc8, 'RET Z', (cpu) => cpu.retIf('z')),
    instr(0xc9, 'RET', (cpu) => cpu.ret()),
    instr(0xca, 'JP Z, a16', (cpu) => cpu.jumpIf(cpu.consumeWordAtPC(), 'z')),
    instr(0xcb, 'PREFIX', (cpu) => cpu.executePrefixedInstruction()),
    instr(0xcc, 'CALL Z, a16', (cpu) => cpu.callIf(cpu.consumeWordAtPC(), 'z')),
    instr(0xcd, 'CALL a16', (cpu) => cpu.call(cpu.consumeWordAtPC())),
    instr(0xce, 'ADC A, d8', (cpu) => cpu.add8RICarry('a', cpu.consumeByteAtPC())),
    instr(0xcf, 'RST 08H', (cpu) => cpu.rst(0x08)),
    instr(0xd0, 'RET NC', (cpu) => cpu.retUnless('c')),
    instr(0xd1, 'POP DE', (cpu) => cpu.pop('de')),
    instr(0xd2, 'JP NC, a16', (cpu) => cpu.jumpUnless(cpu.consumeWordAtPC(), 'c')),
    instr(0xd3, 'ILLEGAL_D3', (cpu) => cpu.illegal(0xd3)),
    instr(0xd4, 'CALL NC, a16', (cpu) => cpu.callUnless(cpu.consumeWordAtPC(), 'c')),
    instr(0xd5, 'PUSH DE', (cpu) => cpu.push('de')),
    instr(0xd6, 'SUB d8', (cpu) => cpu.subtract8RI('a', cpu.consumeByteAtPC())),
    instr(0xd7, 'RST 10H', (cpu) => cpu.rst(0x10)),
    instr(0xd8, 'RET C', (cpu) => cpu.retIf('c')),
    instr(0xd9, 'RETI', (cpu) => cpu.reti()),
    instr(0xda, 'JP C, a16', (cpu) => cpu.jumpIf(cpu.consumeWordAtPC(), 'c')),
    instr(0xdb, 'ILLEGAL_DB', (cpu) => cpu.illegal(0xdb)),
    instr(0xdc, 'CALL C, a16', (cpu) => cpu.callIf(cpu.consumeWordAtPC(), 'c')),
    instr(0xdd, 'ILLEGAL_DD', (cpu) => cpu.illegal(0xdd)),
    instr(0xde, 'SBC A, d8', (cpu) => cpu.subtract8RICarry('a', cpu.consumeByteAtPC())),
    instr(0xdf, 'RST 18H', (cpu) => cpu.rst(0x18)),
    instr(0xe0, 'LDH (a8), A', (cpu) => cpu.loadhAR(cpu.consumeByteAtPC(), 'a')),
    instr(0xe1, 'POP HL', (cpu) => cpu.pop('hl')),
    instr(0xe2, 'LD (C), A', (cpu) => cpu.loadhMR('c', 'a')),
    instr(0xe3, 'ILLEGAL_E3', (cpu) => cpu.illegal(0xe3)),
    instr(0xe4, 'ILLEGAL_E4', (cpu) => cpu.illegal(0xe4)),
    instr(0xe5, 'PUSH HL', (cpu) => cpu.push('hl')),
    instr(0xe6, 'AND d8', (cpu) => cpu.and8RI('a', cpu.consumeByteAtPC())),
    instr(0xe7, 'RST 20H', (cpu) => cpu.rst(0x20)),
    instr(0xe8, 'ADD SP, r8', (cpu) => cpu.add16RI('sp', cpu.consumeByteAtPC())),
    instr(0xe9, 'JP HL', (cpu) => cpu.jumpHL()),
    instr(0xea, 'LD (a16), A', (cpu) => cpu.load8AR(cpu.consumeWordAtPC(), 'a')),
    instr(0xeb, 'ILLEGAL_EB', (cpu) => cpu.illegal(0xeb)),
    instr(0xec, 'ILLEGAL_EC', (cpu) => cpu.illegal(0xec)),
    instr(0xed, 'ILLEGAL_ED', (cpu) => cpu.illegal(0xed)),
    instr(0xee, 'XOR d8', (cpu) => cpu.xor8RI('a', cpu.consumeByteAtPC())),
    instr(0xef, 'RST 28H', (cpu) => cpu.rst(0x28)),
    instr(0xf0, 'LDH A, (a8)', (cpu) => cpu.loadhRA('a', cpu.consumeByteAtPC())),
    instr(0xf1, 'POP AF', (cpu) => cpu.pop('af')),
    instr(0xf2, 'LD A, (C)', (cpu) => cpu.loadhRM('a', 'c')),
    instr(0xf3, 'DI', (cpu) => cpu.setIME(Interrupts.Disabled)),
    instr(0xf4, 'ILLEGAL_F4', (cpu) => cpu.illegal(0xf4)),
    instr(0xf5, 'PUSH AF', (cpu) => cpu.push('af')),
    instr(0xf6, 'OR d8', (cpu) => cpu.or8RI('a', cpu.consumeByteAtPC())),
    instr(0xf7, 'RST 30H', (cpu) => cpu.rst(0x30)),
    instr(0xf8, 'LD HL, SP + r8', (cpu) => cpu.loadSPRI('hl', cpu.consumeByteAtPC())),
    instr(0xf9, 'LD SP, HL', (cpu) => cpu.load16RR('sp', 'hl')),
    instr(0xfa, 'LD A, (a16)', (cpu) => cpu.load8RA('a', cpu.consumeWordAtPC())),
    instr(0xfb, 'EI', (cpu) => cpu.setIME(Interrupts.Enabling)),
    instr(0xfc, 'ILLEGAL_FC', (cpu) => cpu.illegal(0xfc)),
    instr(0xfd, 'ILLEGAL_FD', (cpu) => cpu.illegal(0xfd)),
    instr(0xfe, 'CP d8', (cpu) => cpu.compare8RI('a', cpu.consumeByteAtPC())),
    instr(0xff, 'RST 38H', (cpu) => cpu.rst(0x38)),
  ];

  // System operations

  private incrementPC(amount = 1): void {
    this.registers.pc = word(this.registers.pc + amount);
  }

  private stop(): Duration {
    this.state = State.Stopped;
    return 4;
  }

  private halt(): Duration {
    this.state = State.Halted;
    // TODO: Deal with interrupts https://gbdev.io/pandocs/halt.html#halt
    return 4;
  }

  private setIME(value: Interrupts): Duration {
    this.ime = value;
    return 4;
  }

  private illegal(opcode: number): Duration {
    throw new Error(`Illegal opcode encountered: 0x${opcode.toString(16).padStart(2, '0')}`);
  }

  // Loads

  private load8RI(dest: ByteRegister, value: Byte): Duration {
    this.registers[dest] = value;
    return 8;
  }

  private load8RR(dest: ByteRegister, src: ByteRegister): Duration {
    this.registers[dest] = this.registers[src];
    return 4;
  }

  private load8RA(dest: ByteRegister, addr: Word): Duration {
    this.registers[dest] = this.memory.readByte(addr);
    return 16;
  }

  private load8MR(addr: WordRegister, src: ByteRegister, bump?: number): Duration {
    this.memory.writeByte(this.registers[addr], this.registers[src]);

    if (typeof bump === 'number') {
      this.registers[addr] = word(this.registers[addr] + bump);
    }

    return 8;
  }

  private load8MI(addr: WordRegister, value: Byte): Duration {
    this.memory.writeByte(this.registers[addr], value);
    return 12;
  }

  private load8RM(dest: ByteRegister, addr: WordRegister, bump?: number): Duration {
    this.registers[dest] = this.memory.readByte(this.registers[addr]);

    if (typeof bump === 'number') {
      this.registers[addr] = word(this.registers[addr] + bump);
    }

    return 8;
  }

  private load8AR(addr: Word, src: ByteRegister): Duration {
    this.memory.writeByte(addr, this.registers[src]);
    return 16;
  }

  private load16RR(dest: WordRegister, src: WordRegister): Duration {
    this.registers[dest] = this.registers[src];
    return 8;
  }

  private load16RI(dest: WordRegister, value: Word): Duration {
    this.registers[dest] = value;
    return 12;
  }

  private load16MR(addr: Word, src: WordRegister): Duration {
    writeWord(this.memory, addr, this.registers[src]);
    return 20;
  }

  private loadhAR(offset: Byte, src: ByteRegister): Duration {
    this.memory.writeByte(0xff00 + offset, this.registers[src]);
    return 12;
  }

  private loadhRA(src: ByteRegister, offset: Byte): Duration {
    this.registers[src] = this.memory.readByte(0xff00 + offset);
    return 12;
  }

  private loadhMR(dest: ByteRegister, src: ByteRegister): Duration {
    let { registers, memory } = this;
    memory.writeByte(0xff00 + registers[dest], registers[src]);
    return 8;
  }

  private loadhRM(dest: ByteRegister, src: ByteRegister): Duration {
    let { registers, memory } = this;
    registers[dest] = memory.readByte(0xff00 + registers[src]);
    return 8;
  }

  private loadSPRI(dest: WordRegister, value: Byte): Duration {
    let { registers, flags } = this;
    let { result, c, h } = addSignedOffset(registers.sp, value);

    registers[dest] = result;
    flags.z = 0;
    flags.n = 0;
    flags.h = h;
    flags.c = c;

    return 12;
  }

  // Stack operations

  private rst(addr: 0x00 | 0x08 | 0x10 | 0x18 | 0x20 | 0x28 | 0x30 | 0x38): Duration {
    this.call(word(addr));
    return 16;
  }

  private call(addr: Word): Duration {
    let { registers, memory } = this;
    let oldPC = registers.pc;

    registers.sp = word(registers.sp - 2);
    registers.pc = addr;

    writeWord(memory, registers.sp, oldPC);

    return 24;
  }

  private callIf(addr: Word, flag: Flag): Duration {
    return this.flags[flag] ? this.call(addr) : 12;
  }

  private callUnless(addr: Word, flag: Flag): Duration {
    return this.flags[flag] ? 12 : this.call(addr);
  }

  private ret(): Duration {
    this.pop('pc');
    return 16;
  }

  private reti(): Duration {
    this.ime = Interrupts.Enabled;
    return this.ret();
  }

  private retIf(flag: Flag): Duration {
    if (this.flags[flag]) {
      this.ret();
      return 20;
    } else {
      return 8;
    }
  }

  private retUnless(flag: Flag): Duration {
    if (!this.flags[flag]) {
      this.ret();
      return 20;
    } else {
      return 8;
    }
  }

  private push(src: WordRegister): Duration {
    let { registers, memory } = this;

    registers.sp = word(registers.sp - 2);
    writeWord(memory, registers.sp, registers[src]);

    return 16;
  }

  private pop(dest: WordRegister): Duration {
    let { registers, memory } = this;

    registers[dest] = readWord(memory, registers.sp);
    registers.sp = word(registers.sp + 2);

    return 12;
  }

  // Increment/Decrement

  private inc8R(register: ByteRegister): Duration {
    let { registers, flags } = this;
    let { result, h, z } = addBytes(registers[register], 1);

    registers[register] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = h;

    return 4;
  }

  private inc8M(register: WordRegister): Duration {
    let { registers, flags, memory } = this;
    let addr = registers[register];
    let { result, z, h } = addBytes(memory.readByte(addr), 1);

    memory.writeByte(addr, result);
    flags.z = z;
    flags.n = 0;
    flags.h = h;

    return 12;
  }

  private dec8R(register: ByteRegister): Duration {
    let { registers, flags } = this;
    let { result, h, z } = subtractBytes(registers[register], 1);

    registers[register] = result;
    flags.z = z;
    flags.n = 1;
    flags.h = h;

    return 4;
  }

  private dec8M(register: WordRegister): Duration {
    let { registers, flags, memory } = this;
    let addr = registers[register];
    let { result, z, h } = subtractBytes(memory.readByte(addr), 1);

    memory.writeByte(addr, result);
    flags.z = z;
    flags.n = 1;
    flags.h = h;

    return 12;
  }

  private inc16R(register: WordRegister): Duration {
    this.registers[register] = word(this.registers[register] + 1);
    return 8;
  }

  private dec16R(register: WordRegister): Duration {
    this.registers[register] = word(this.registers[register] + 0xffff);
    return 8;
  }

  // One-off bit-twiddling operations

  private daa(): Duration {
    let { flags, registers } = this;
    let { result, overflow } = decimalAdjust(registers.a, flags.n, flags.h, flags.c);

    registers.a = result;
    flags.z = bit(result === 0);
    flags.h = 0;
    flags.c = overflow;

    return 4;
  }

  private cpl(): Duration {
    let { registers, flags } = this;

    registers.a = byte(~registers.a);
    flags.n = 1;
    flags.h = 1;

    return 4;
  }

  private setCarryFlag(value: Bit): Duration {
    let { flags } = this;

    flags.n = 0;
    flags.h = 0;
    flags.c = value;

    return 4;
  }

  // Bitwise operations

  private and8RR(dest: ByteRegister, src: ByteRegister): Duration {
    let { registers, flags } = this;
    let result = byte(registers[dest] & registers[src]);

    registers[dest] = result;
    flags.z = bit(result === 0);
    flags.n = 0;
    flags.h = 1;
    flags.c = 0;

    return 4;
  }

  private and8RM(dest: ByteRegister, addr: WordRegister): Duration {
    let { registers, flags } = this;
    let result = byte(registers[dest] & this.memory.readByte(registers[addr]));

    registers[dest] = result;
    flags.z = bit(result === 0);
    flags.n = 0;
    flags.h = 1;
    flags.c = 0;

    return 8;
  }

  private and8RI(dest: ByteRegister, value: Byte): Duration {
    let { registers, flags } = this;
    let result = byte(registers[dest] & value);

    registers[dest] = result;
    flags.z = bit(result === 0);
    flags.n = 0;
    flags.h = 1;
    flags.c = 0;

    return 8;
  }

  private xor8RR(dest: ByteRegister, src: ByteRegister): Duration {
    let { registers, flags } = this;
    let result = byte(registers[dest] ^ registers[src]);

    registers[dest] = result;
    flags.z = bit(result === 0);
    flags.n = 0;
    flags.h = 0;
    flags.c = 0;

    return 4;
  }

  private xor8RM(dest: ByteRegister, addr: WordRegister): Duration {
    let { registers, flags } = this;
    let result = byte(registers[dest] ^ this.memory.readByte(registers[addr]));

    registers[dest] = result;
    flags.z = bit(result === 0);
    flags.n = 0;
    flags.h = 0;
    flags.c = 0;

    return 8;
  }

  private xor8RI(dest: ByteRegister, value: Byte): Duration {
    let { registers, flags } = this;
    let result = byte(registers[dest] ^ value);

    registers[dest] = result;
    flags.z = bit(result === 0);
    flags.n = 0;
    flags.h = 0;
    flags.c = 0;

    return 8;
  }

  private or8RR(dest: ByteRegister, src: ByteRegister): Duration {
    let { registers, flags } = this;
    let result = byte(registers[dest] | registers[src]);

    registers[dest] = result;
    flags.z = bit(result === 0);
    flags.n = 0;
    flags.h = 0;
    flags.c = 0;

    return 4;
  }

  private or8RM(dest: ByteRegister, addr: WordRegister): Duration {
    let { registers, flags } = this;
    let result = byte(registers[dest] | this.memory.readByte(registers[addr]));

    registers[dest] = result;
    flags.z = bit(result === 0);
    flags.n = 0;
    flags.h = 0;
    flags.c = 0;

    return 8;
  }

  private or8RI(dest: ByteRegister, value: Byte): Duration {
    let { registers, flags } = this;
    let result = byte(registers[dest] | value);

    registers[dest] = result;
    flags.z = bit(result === 0);
    flags.n = 0;
    flags.h = 0;
    flags.c = 0;

    return 8;
  }

  private compare8RR(a: ByteRegister, b: ByteRegister): Duration {
    let { registers, flags } = this;
    let { z, h, c } = subtractBytes(registers[a], registers[b]);

    flags.z = z;
    flags.n = 1;
    flags.h = h;
    flags.c = c;

    return 4;
  }

  private compare8RM(a: ByteRegister, b: WordRegister): Duration {
    let { registers, flags, memory } = this;
    let { z, h, c } = subtractBytes(registers[a], memory.readByte(registers[b]));

    flags.z = z;
    flags.n = 1;
    flags.h = h;
    flags.c = c;

    return 8;
  }

  private compare8RI(a: ByteRegister, value: Byte): Duration {
    let { registers, flags } = this;
    let { z, h, c } = subtractBytes(registers[a], value);

    flags.z = z;
    flags.n = 1;
    flags.h = h;
    flags.c = c;

    return 8;
  }

  // Addition/Subtraction

  private add16RR(dest: WordRegister, src: WordRegister): Duration {
    let { registers, flags } = this;
    let { result, h, c } = addWords(registers[dest], registers[src]);

    registers[dest] = result;
    flags.n = 0;
    flags.h = h;
    flags.c = c;

    return 8;
  }

  private add16RI(dest: WordRegister, value: Byte): Duration {
    let { registers, flags } = this;
    let { result, h, c } = addSignedOffset(registers[dest], value);

    registers[dest] = result;
    flags.z = 0;
    flags.n = 0;
    flags.h = h;
    flags.c = c;

    return 16;
  }

  private add8RI(dest: ByteRegister, value: Byte): Duration {
    let { registers, flags } = this;
    let { result, z, h, c } = addBytes(registers[dest], value);

    registers[dest] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = h;
    flags.c = c;

    return 8;
  }

  private add8RICarry(dest: ByteRegister, value: Byte): Duration {
    let { registers, flags } = this;
    let { result, z, h, c } = addBytesCarry(registers[dest], value, flags.c);

    registers[dest] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = h;
    flags.c = c;

    return 8;
  }

  private add8RR(dest: ByteRegister, src: ByteRegister): Duration {
    let { registers, flags } = this;
    let { result, z, h, c } = addBytes(registers[dest], registers[src]);

    registers[dest] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = h;
    flags.c = c;

    return 4;
  }

  private add8RRCarry(dest: ByteRegister, src: ByteRegister): Duration {
    let { registers, flags } = this;
    let { result, z, h, c } = addBytesCarry(registers[dest], registers[src], flags.c);

    registers[dest] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = h;
    flags.c = c;

    return 4;
  }

  private add8RM(dest: ByteRegister, src: WordRegister): Duration {
    let { registers, flags } = this;
    let value = this.memory.readByte(registers[src]);
    let { result, z, h, c } = addBytes(registers[dest], value);

    registers[dest] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = h;
    flags.c = c;

    return 8;
  }

  private add8RMCarry(dest: ByteRegister, src: WordRegister): Duration {
    let { registers, flags } = this;
    let value = this.memory.readByte(registers[src]);
    let { result, z, h, c } = addBytesCarry(registers[dest], value, flags.c);

    registers[dest] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = h;
    flags.c = c;

    return 8;
  }

  private subtract8RI(dest: ByteRegister, value: Byte): Duration {
    let { registers, flags } = this;
    let { result, z, h, c } = subtractBytes(registers[dest], value);

    registers[dest] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = h;
    flags.c = c;

    return 8;
  }

  private subtract8RICarry(dest: ByteRegister, value: Byte): Duration {
    let { registers, flags } = this;
    let { result, z, h, c } = subtractBytesCarry(registers[dest], value, flags.c);

    registers[dest] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = h;
    flags.c = c;

    return 8;
  }

  private subtract8RR(dest: ByteRegister, src: ByteRegister): Duration {
    let { registers, flags } = this;
    let { result, z, h, c } = subtractBytes(registers[dest], registers[src]);

    registers[dest] = result;
    flags.z = z;
    flags.n = 1;
    flags.h = h;
    flags.c = c;

    return 4;
  }

  private subtract8RRCarry(dest: ByteRegister, src: ByteRegister): Duration {
    let { registers, flags } = this;
    let { result, z, h, c } = subtractBytesCarry(registers[dest], registers[src], flags.c);

    registers[dest] = result;
    flags.z = z;
    flags.n = 1;
    flags.h = h;
    flags.c = c;

    return 4;
  }

  private subtract8RM(dest: ByteRegister, src: WordRegister): Duration {
    let { registers, flags } = this;
    let value = this.memory.readByte(registers[src]);
    let { result, z, h, c } = subtractBytes(registers[dest], value);

    registers[dest] = result;
    flags.z = z;
    flags.n = 1;
    flags.h = h;
    flags.c = c;

    return 8;
  }

  private subtract8RMCarry(dest: ByteRegister, src: WordRegister): Duration {
    let { registers, flags } = this;
    let value = this.memory.readByte(registers[src]);
    let { result, z, h, c } = subtractBytesCarry(registers[dest], value, flags.c);

    registers[dest] = result;
    flags.z = z;
    flags.n = 1;
    flags.h = h;
    flags.c = c;

    return 8;
  }

  // Rotations

  private rotateLeft(register: ByteRegister): Duration {
    let { registers, flags } = this;
    let { result, z, c } = rotateLeft(registers[register], flags.c);

    registers[register] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = 0;
    flags.c = c;

    return 8;
  }

  private rotateLeftCarry(register: ByteRegister): Duration {
    let { registers, flags } = this;
    let { result, z, c } = rotateLeft(registers[register]);

    registers[register] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = 0;
    flags.c = c;

    return 8;
  }

  private rotateRight(register: ByteRegister): Duration {
    let { registers, flags } = this;
    let { result, z, c } = rotateRight(registers[register], flags.c);

    registers[register] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = 0;
    flags.c = c;

    return 8;
  }

  private rotateRightCarry(register: ByteRegister): Duration {
    let { registers, flags } = this;
    let { result, z, c } = rotateRight(registers[register]);

    registers[register] = result;
    flags.z = z;
    flags.n = 0;
    flags.h = 0;
    flags.c = c;

    return 8;
  }

  // Special faster, smaller rotate instructions that specifically operate
  // on the a register and always clear the zero flag

  private rotateLeftA(): Duration {
    this.rotateLeft('a');
    this.flags.z = 0;
    return 4;
  }

  private rotateLeftCarryA(): Duration {
    this.rotateLeftCarry('a');
    this.flags.z = 0;
    return 4;
  }

  private rotateRightA(): Duration {
    this.rotateRight('a');
    this.flags.z = 0;
    return 4;
  }

  private rotateRightCarryA(): Duration {
    this.rotateRightCarry('a');
    this.flags.z = 0;
    return 4;
  }

  // Jumps

  private jump(address: Word): Duration {
    this.registers.pc = address;
    return 16;
  }

  private jumpHL(): Duration {
    this.registers.pc = this.registers.hl;
    return 4;
  }

  private jumpIf(address: Word, flag: Flag): Duration {
    return this.flags[flag] ? this.jump(address) : 12;
  }

  private jumpUnless(address: Word, flag: Flag): Duration {
    return this.flags[flag] ? 12 : this.jump(address);
  }

  private jumpRelative(offset: Byte): Duration {
    this.incrementPC(signedByte(offset));
    return 12;
  }

  private jumpRelativeIf(offset: Byte, flag: Flag): Duration {
    return this.flags[flag] ? this.jumpRelative(offset) : 8;
  }

  private jumpRelativeUnless(offset: Byte, flag: Flag): Duration {
    return this.flags[flag] ? 8 : this.jumpRelative(offset);
  }

  // Prefixed Instructions

  private executePrefixedInstruction(): Duration {
    let opcode = this.consumeByteAtPC();

    let category = (opcode & 0xc0) >> 6;
    let bit = (opcode & 0x38) >> 3;
    let register = PREFIX_REGISTER_CODES[opcode & 0x07];

    switch (category) {
      case 0:
        return register === 'hl' ? this.prefixM(bit, 'hl') : this.prefixR(bit, register);
      case 1:
        return register === 'hl' ? this.bitM(bit, 'hl') : this.bitR(bit, register);
      case 2:
        return register === 'hl' ? this.resM(bit, 'hl') : this.resR(bit, register);
      case 3:
        return register === 'hl' ? this.setM(bit, 'hl') : this.setR(bit, register);
    }

    throw new Error(`Internal error: unexpected prefixed instruction 0x${opcode.toString(16)}`);
  }

  private prefixR(instruction: number, location: ByteRegister): Duration {
    this.registers[location] = this.prefix(instruction, this.registers[location]);
    return 8;
  }

  private bitR(index: number, location: ByteRegister): Duration {
    this.bit(index, this.registers[location]);
    return 8;
  }

  private resR(index: number, location: ByteRegister): Duration {
    this.registers[location] = this.res(index, this.registers[location]);
    return 8;
  }

  private setR(index: number, location: ByteRegister): Duration {
    this.registers[location] = this.set(index, this.registers[location]);
    return 8;
  }

  private prefixM(instruction: number, location: WordRegister): Duration {
    let { registers, memory } = this;
    let addr = registers[location];
    let result = this.prefix(instruction, memory.readByte(addr));

    memory.writeByte(addr, result);

    return 16;
  }

  private bitM(index: number, location: WordRegister): Duration {
    this.bit(index, this.memory.readByte(this.registers[location]));
    return 12;
  }

  private resM(index: number, location: WordRegister): Duration {
    let { registers, memory } = this;
    let addr = registers[location];
    let result = this.res(index, memory.readByte(addr));

    memory.writeByte(addr, result);

    return 16;
  }

  private setM(index: number, location: WordRegister): Duration {
    let { registers, memory } = this;
    let addr = registers[location];
    let result = this.set(index, memory.readByte(addr));

    memory.writeByte(addr, result);

    return 16;
  }

  private prefix(instruction: number, value: Byte): Byte {
    let { flags } = this;
    let { result, c, z } = this.applyPrefixInstruction(instruction, value);

    flags.z = z;
    flags.n = 0;
    flags.h = 0;
    flags.c = c;

    return result;
  }

  private bit(index: number, value: Byte): void {
    let { flags } = this;

    flags.z = bit(!(value & (1 << index)));
    flags.n = 0;
    flags.h = 1;
  }

  private res(index: number, value: Byte): Byte {
    return byte(value & ~(1 << index));
  }

  private set(index: number, value: Byte): Byte {
    return byte(value | (1 << index));
  }

  private applyPrefixInstruction(instruction: number, value: Byte): { result: Byte; z: Bit; c: Bit } {
    switch (instruction) {
      case 0:
        return rotateLeft(value);
      case 1:
        return rotateRight(value);
      case 2:
        return rotateLeft(value, this.flags.c);
      case 3:
        return rotateRight(value, this.flags.c);
      case 4:
        return shiftLeftA(value);
      case 5:
        return shiftRightA(value);
      case 6:
        return swap(value);
      case 7:
        return shiftRightL(value);
    }

    throw new Error(`Internal error: unexpected prefix instruction 0x${instruction.toString(16)}`);
  }

  // Operand consumption

  private consumeByteAtPC(): Byte {
    let value = this.memory.readByte(this.registers.pc);
    this.incrementPC();
    return value;
  }

  private consumeWordAtPC(): Word {
    let value = readWord(this.memory, this.registers.pc);
    this.incrementPC(2);
    return value;
  }
}

const FLAG_NAMES: Array<Flag> = ['z', 'n', 'h', 'c'];
const PREFIX_REGISTER_CODES: Array<ByteRegister | 'hl'> = ['b', 'c', 'd', 'e', 'h', 'l', 'hl', 'a'];
