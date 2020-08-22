import { asm } from './helpers/compile-rom';
import Cartridge, { CGBSupport, SGBSupport, MBCType } from '../src/cartridge';

describe('Cartridge', () => {
  test('loading a simple ROM', async () => {
    let { rom } = await asm`
      SECTION "Header", ROM0[$100]
    `;

    let cart = new Cartridge(rom);

    expect(cart.hasValidHeader()).toBe(true);
    expect(cart.info).toMatchObject({
      cgbSupport: CGBSupport.None,
      sgbSupport: SGBSupport.None,
      mbcType: MBCType.ROM,
      title: 'TEST',
    });
  });

  test('with CGB and SGB support', async () => {
    let { rom } = await asm({ cgbSupport: CGBSupport.Required, sgbSupport: SGBSupport.Supported })`
      SECTION "Header", ROM0[$100]
    `;

    expect(new Cartridge(rom).info).toMatchObject({
      cgbSupport: CGBSupport.Required,
      sgbSupport: SGBSupport.Supported,
    });
  });

  test('with invalid header checksum', async () => {
    let { rom } = await asm({ setHeaderChecksum: false })`
      SECTION "Header", ROM0[$100]
    `;

    expect(new Cartridge(rom).hasValidHeader()).toBe(false);
  });

  test('with invalid logo bytes', async () => {
    let { rom } = await asm({ setNintendoLogo: false })`
      SECTION "Header", ROM0[$100]
    `;

    expect(new Cartridge(rom).hasValidHeader()).toBe(false);
  });
});
