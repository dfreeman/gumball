import os from 'os';
import fs from 'fs';
import glob from 'glob';
import execa from 'execa';
import { stripIndent } from 'common-tags';
import { CGBSupport, MBCType, SGBSupport } from '../../src/cartridge';

export type Files = string | Uint8Array | { [name: string]: Files };

export type CompilationOptions = {
  cgbSupport?: CGBSupport;
  sgbSupport?: SGBSupport;
  setNintendoLogo?: boolean;
  setHeaderChecksum?: boolean;
  setGlobalChecksum?: boolean;
  gameID?: string;
  mbcType?: MBCType;
  romVersion?: number;
  title?: string;
};

export type CompilationResult = {
  rom: Uint8Array;
  map: string;
  symbols: string;
};

export function asm(strings: TemplateStringsArray, ...rest: Array<unknown>): Promise<CompilationResult>;
export function asm(
  options: CompilationOptions,
): (strings: TemplateStringsArray, ...rest: Array<unknown>) => Promise<CompilationResult>;
export function asm(contentsOrOptions: TemplateStringsArray | CompilationOptions, ...rest: Array<unknown>): unknown {
  if (!Array.isArray(contentsOrOptions)) {
    return (strings: TemplateStringsArray, ...rest: Array<unknown>) =>
      compile({ 'main.asm': stripIndent(strings, ...rest) }, contentsOrOptions as CompilationOptions);
  } else {
    return asm({})(contentsOrOptions as TemplateStringsArray, ...rest);
  }
}

export async function compile(files: Files, options: CompilationOptions = {}): Promise<CompilationResult> {
  let root = `${os.tmpdir()}/compile-${Math.random().toString(36).slice(2)}`;
  let cwd = `${root}/inputs`;

  writeFiles(cwd, files);

  for (let source of glob.sync('**/*.asm', { cwd })) {
    await execa('rgbasm', [source, '-o', source.replace(/\.asm$/, '.o')], { cwd });
  }

  let objectFiles = glob.sync('**/*.o', { cwd });
  let linkFlags = ['-o', `../rom.gb`, '-m', '../rom.map', '-n', '../rom.sym'];
  let fixFlags = buildFixFlags(options);

  await execa('rgblink', [...linkFlags, ...objectFiles], { cwd });
  await execa('rgbfix', ['../rom.gb', ...fixFlags], { cwd });

  let rom = fs.readFileSync(`${root}/rom.gb`);
  let map = fs.readFileSync(`${root}/rom.map`, 'utf-8');
  let symbols = fs.readFileSync(`${root}/rom.sym`, 'utf-8');

  fs.rmSync(root, { recursive: true });

  return { rom, map, symbols };
}

function buildFixFlags(options: CompilationOptions): Array<string> {
  let flags: Array<string> = [];
  let fix = '';

  if (options.cgbSupport === CGBSupport.Supported) {
    flags.push('--color-compatible');
  } else if (options.cgbSupport === CGBSupport.Required) {
    flags.push('--color-only');
  }

  if (options.sgbSupport === SGBSupport.Supported) {
    flags.push('--sgb-compatible');
  }

  if (options.setNintendoLogo !== false) {
    fix += 'l';
  }

  if (options.setHeaderChecksum !== false) {
    fix += 'h';
  }

  if (options.setGlobalChecksum !== false) {
    fix += 'g';
  }

  if (fix) {
    flags.push('--fix-spec', fix);
  }

  if (options.gameID) {
    flags.push('--game-id', options.gameID);
  }

  if (options.mbcType) {
    flags.push('--mbc-type', `${options.mbcType}`);
  }

  if (options.romVersion) {
    flags.push('--rom-version', `${options.romVersion}`);
  }

  flags.push('--title', options.title ?? 'TEST');

  return flags;
}

function writeFiles(location: string, files: Files): void {
  if (typeof files === 'string' || files instanceof Uint8Array) {
    fs.writeFileSync(location, files);
  } else {
    fs.mkdirSync(location, { recursive: true });
    for (let [name, file] of Object.entries(files)) {
      writeFiles(`${location}/${name}`, file);
    }
  }
}
