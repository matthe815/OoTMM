import path from 'path';
import fs from 'fs/promises';
import { DecompressedRoms, fileExists } from '@ootmm/core';

import { TextureFormat, png } from './png';
import { KeepFile } from './keep';
import { font } from './font';

function filenameToDefine(filename: string) {
  return filename.replace(/\.[^/.]+$/, "").replace(/\//g, '_').toUpperCase();
}

type FileRecord = {
  filename: string | null;
  vrom: number;
  size: number;
  compressed: boolean;
  defineBase: string;
  defineExtras?: {[k: string]: number};
  objectId?: number;
}

class AssetsBuilder {
  private vrom = 0x08000000;
  private objectId = 0x2000;
  private files: FileRecord[] = [];

  constructor() {

  }

  private async makeRecord(defineBase: string, filename: string | null, size: number, compressed: boolean) {
    const sizeAligned = (size + 0xf) & ~0xf;
    const record: FileRecord = {
      filename,
      vrom: this.vrom,
      size: sizeAligned,
      compressed,
      defineBase,
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
      return await this.makeRecord(filenameToDefine(filename), filename, data.length, !!compressed);
    }
  }

  async importTexture(filename: string, format: TextureFormat, record: boolean) {
    const data = await png(filename, format);
    await this.importData(data, filename + '.bin', record, true);
    return data;
  }

  async importFile(filename: string, record: boolean, compressed?: boolean) {
    const data = await fs.readFile(path.join(__dirname, '..', 'assets', filename));
    await this.importData(data, filename, record, compressed);
  }

  async importObject(filename: string, args: number[]) {
    const data = await fs.readFile(path.join(__dirname, '..', 'assets', filename));
    const record = (await this.importData(data, filename, true, true))!;
    record.objectId = this.objectId++;
    record.defineExtras = {};
    for (let i = 0; i < args.length; i++) {
      record.defineExtras[i.toString()] = args[i];
    }
  }

  async emitReceipt() {
    const data = {
      files: this.files,
    };

    const outPath = path.join(__dirname, '..', 'custom.json');
    const dataStr = JSON.stringify(data);
    let shouldEmit = true;
    if (await fileExists(outPath)) {
      const previousDataStr = await fs.readFile(outPath, 'utf8');
      if (previousDataStr === dataStr) {
        shouldEmit = false;
      }
    }
    if (shouldEmit) {
      await fs.writeFile(outPath, dataStr);
    }
  }
}

const TEXTURES: {[k: string]: TextureFormat} = {
  'chests/major_front': 'rgba16',
  'chests/major_side': 'rgba16',
  'chests/key_front': 'rgba16',
  'chests/key_side': 'rgba16',
  'chests/spider_front': 'rgba16',
  'chests/spider_side': 'rgba16',
  'chests/fairy_front': 'rgba16',
  'chests/fairy_side': 'rgba16',
  'chests/heart_front': 'rgba16',
  'chests/heart_side': 'rgba16',
  'pots/major_side': 'rgba16',
  'pots/major_top': 'rgba16',
  'pots/spider_side': 'rgba16',
  'pots/spider_top': 'rgba16',
  'pots/key_side': 'rgba16',
  'pots/fairy_side': 'rgba16',
  'pots/fairy_top': 'rgba16',
  'pots/heart_side': 'rgba16',
  'pots/heart_top': 'rgba16',
  'pots/bosskey_side': 'rgba16',
  'pots/bosskey_top': 'rgba16',
};

const OBJECTS: {[k: string]: number[]} = {
  'objects/triforce.zobj': [0x6000a30],
  'objects/btn_a.zobj': [0x6000da0],
  'objects/btn_c_horizontal.zobj': [0x6000e10],
  'objects/btn_c_vertical.zobj': [0x6000960],
};

const KEEP_TEXTURES: {[k: string]: string} = {
  DPAD: 'dpad',
  ICON_KEY: 'icons/key',
  ICON_BOSS_KEY: 'icons/boss_key',
  ICON_MAP: 'icons/map',
  ICON_COMPASS: 'icons/compass',
  ICON_FAIRY: 'icons/fairy',
  ICON_SKULL: 'icons/skull',
  ICON_TRIFORCE: 'icons/triforce',
  ICON_RUPEE: 'icons/rupee',
  ICON_COIN: 'icons/coin',
};

export async function makeAssets(decompressedRoms: DecompressedRoms | null) {
  const builder = new AssetsBuilder();
  for (const [filename, format] of Object.entries(TEXTURES)) {
    await builder.importTexture(filename, format, true);
  }

  for (const [filename, args] of Object.entries(OBJECTS)) {
    await builder.importObject(filename, args);
  }

  /* Keep */
  const keep = new KeepFile();
  const keepOffsets: {[k: string]: number} = {};
  const dataFont = await font('font');
  keepOffsets['FONT'] = keep.addData(dataFont);
  for (const [name, filename] of Object.entries(KEEP_TEXTURES)) {
    const data = await png(filename, 'rgba32');
    keepOffsets[name] = keep.addData(data);
  }
  const dataKeep = keep.pack();
  const keepRecord = await builder.importData(dataKeep, 'keep', true, true);
  keepRecord!.defineExtras = keepOffsets;

  /* MQ */
  await builder.importFile('mq/rooms.bin', true, false);
  await builder.importFile('mq/scenes.bin', true, false);
  await builder.importFile('mq/maps.bin', true, true);

  if (decompressedRoms) {
    await builder.emitReceipt();
  }
}
