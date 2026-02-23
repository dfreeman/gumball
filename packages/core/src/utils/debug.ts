import chalk from 'chalk';
import stripAnsi from 'strip-ansi';
import { table } from 'table';
import { Byte } from '#src/utils/sized-numbers';

export const label = {
  bit: chalk.cyan,
  byte: chalk.blue,
  word: chalk.green,
};

export function atom(value: unknown): string {
  return chalk.yellow(value);
}

export function flag(value: Byte, bit: number, onValue = 'On', offValue = chalk.gray('Off')): string {
  return value & (1 << bit) ? onValue : offValue;
}

export function value(value: number, pad = 2): string {
  return `0x${value.toString(16).padStart(pad, '0')}`;
}

export function palette(value: Byte, size: number): string {
  let result = [];
  for (let i = 0; i < 4; i++) {
    if (i < size) {
      let offset = 3 - i;
      let color = (value & (0b11 << (2 * offset))) >>> (2 * offset);
      let rgb = 255 - 60 * color;
      result.push(chalk.rgb(rgb, rgb, rgb)(color));
    } else {
      result.push('-');
    }
  }
  return result.join(' ');
}

export function tables(data: Record<string, Array<Array<string>>>): string {
  return sideBySide(Object.entries(data).map(([label, values]) => `${label}\n${table(values)}`));
}

function printWidth(str: string): number {
  let total = 0;
  let iterator = stripAnsi(str)[Symbol.iterator]();
  while (!iterator.next().done) total++;
  return total;
}

function sideBySide(blocks: Array<string>, separator = '  '): string {
  let blocksByLines = blocks.map((block) => block.split('\n'));
  let blockLineWidths = blocksByLines.map((blockLines) => blockLines.map(printWidth));
  let blockWidths = blockLineWidths.map((blockLineWidths) => Math.max(...blockLineWidths));
  let height = Math.max(...blocksByLines.map((blockLines) => blockLines.length));

  let output = [];
  for (let lineIndex = 0; lineIndex < height; lineIndex++) {
    let line = [];
    for (let blockIndex = 0; blockIndex < blocksByLines.length; blockIndex++) {
      if (blockIndex > 0) {
        line.push(separator);
      }

      let blockLine = blocksByLines[blockIndex]?.[lineIndex] ?? '';
      let lineWidth = blockLineWidths[blockIndex]?.[lineIndex] ?? 0;
      let blockWidth = blockWidths[blockIndex];
      line.push(blockLine);
      line.push(Array(blockWidth - lineWidth + 1).join(' '));
    }
    output.push(line.join(''));
  }

  return output.join('\n');
}
