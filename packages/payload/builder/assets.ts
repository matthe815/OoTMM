import path from 'path';
import fs from 'fs/promises';

import { TextureFormat, png } from './png';

type FileRecord = {
  filename: string | null;
  vrom: number;
  size: number;
  compressed: boolean;
}

class AssetsBuilder {
  private vrom = 0x08000000;
  private files: FileRecord[] = [];

  constructor() {

  }

  private async makeRecord(filename: string | null, size: number, compressed: boolean) {
    const sizeAligned = (size + 0xf) & ~0xf;
    const record: FileRecord = {
      filename,
      vrom: this.vrom,
      size: sizeAligned,
      compressed,
    };
    this.vrom += sizeAligned;
    this.files.push(record);
    console.log(record);
    return record;
  }

  async importData(data: Buffer, filename: string, record?: boolean, compressed?: boolean) {
    /* Create the output dir */
    const outfile = path.join(__dirname, '..', 'build', 'assets', filename);
    const outdir = path.dirname(outfile);
    await fs.mkdir(outdir, { recursive: true });

    /* Write the file */
    await fs.writeFile(outfile, data);

    /* Create the record */
    if (record) {
      await this.makeRecord(filename, data.length, !!compressed);
    }
  }

  async importTexture(filename: string, format: TextureFormat, record: boolean) {
    const data = await png(filename, format);
    await this.importData(data, filename + '.bin', record, true);
    return data;
  }
}

const TEXTURES: {[k: string]: TextureFormat} = {
  'chests/front_major': 'rgba16',
  'chests/side_major': 'rgba16',
  'chests/front_key': 'rgba16',
  'chests/side_key': 'rgba16',
  'chests/front_spider': 'rgba16',
  'chests/side_spider': 'rgba16',
  'chests/front_fairy': 'rgba16',
  'chests/side_fairy': 'rgba16',
  'chests/front_heart': 'rgba16',
  'chests/side_heart': 'rgba16',
  'pots/side_major': 'rgba16',
  'pots/top_major': 'rgba16',
  'pots/side_spider': 'rgba16',
  'pots/top_spider': 'rgba16',
  'pots/side_key': 'rgba16',
  'pots/side_fairy': 'rgba16',
  'pots/top_fairy': 'rgba16',
  'pots/side_heart': 'rgba16',
  'pots/top_heart': 'rgba16',
  'pots/side_bosskey': 'rgba16',
  'pots/top_bosskey': 'rgba16',
};

export async function makeAssets() {
  const builder = new AssetsBuilder();
  for (const [filename, format] of Object.entries(TEXTURES)) {
    await builder.importTexture(filename, format, true);
  }
}
