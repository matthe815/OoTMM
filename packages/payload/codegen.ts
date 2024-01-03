import { promises as fs } from 'fs';
import path from 'path';
import { PATCH_GROUP_VALUES, CONFVARS_VALUES, PRICE_RANGES, GI, DRAWGI, CodeGen } from '@ootmm/core';
import { ENTRANCES, NPC, SCENES } from '@ootmm/data';

const codegenFile = async (data: {[k: string]: number}, prefix: string, filename: string, guard: string) => {
  if (!process.env.ROLLUP) {
    const cg = new CodeGen(path.resolve('build', 'include', 'combo', filename), guard);
    for (const [k, v] of Object.entries(data)) {
      cg.define(prefix + "_" + k, v);
    }
    await cg.emit();
  }
};

/* Split on <> tags and extract the inner macro */
/* TODO: Make this less ugly */
function textMacro(data: string) {
  data = `"${data}"`;
  data = data.replace(/<[^>]+>/g, (match) => {
    return `" TEXT_${match.substring(1, match.length - 1)} "`;
  });
  return data;
}

async function genGI() {
  /* Header */
  const cgHeader = new CodeGen(path.resolve('build', 'include', 'combo', 'gi_data.h'), "GENERATED_GI_DATA_H");
  cgHeader.define('GI_NONE', 0);
  for (const gi of Object.values(GI)) {
    cgHeader.define(`GI_${gi.id}`, gi.index);
  }
  await cgHeader.emit();

  /* Source */
  const cgSource = new CodeGen(path.resolve('build', 'src', 'common', 'gi_data.c'));
  cgSource.include('combo.h');
  cgSource.include('combo/custom.h');
  cgSource.include('combo/item.h');
  cgSource.include('combo/sr.h');
  cgSource.raw('');
  cgSource.raw('#if defined(GAME_OOT)');
  cgSource.raw('# define OBJECT_OOT(x) x');
  cgSource.raw('# define OBJECT_MM(x) ((x) ^ MASK_FOREIGN_OBJECT)');
  cgSource.raw('#else');
  cgSource.raw('# define OBJECT_OOT(x) ((x) ^ MASK_FOREIGN_OBJECT)');
  cgSource.raw('# define OBJECT_MM(x) x');
  cgSource.raw('#endif');
  cgSource.raw('');
  cgSource.raw('const GetItem kExtendedGetItems[] = {');
  for (const gi of Object.values(GI)) {
    let fields: string[] = [];
    fields.push(gi.item);
    fields.push(`0x${gi.flags.toString(16)}`);
    fields.push(gi.draw);
    fields.push('0x01'); /* Dummy text ID */
    if (!gi.object) {
      fields.push('0x0000');
    } else {
      if (gi.object.type === 'custom') {
        fields.push(`CUSTOM_OBJECT_ID_${gi.object.id}`);
      } else {
        fields.push(`OBJECT_${gi.object.type.toUpperCase()}(0x${gi.object.id.toString(16)})`);
      }
    }
    cgSource.raw(`    { ${fields.join(', ')} },`);
  }
  cgSource.raw('};');
  cgSource.raw('');
  cgSource.table('kGetItemDrawGiParam', 'u8', Object.values(GI).map(gi => gi.drawParam));
  cgSource.raw('');
  cgSource.raw('const char* const kItemNames[] = {');
  for (const gi of Object.values(GI)) {
    cgSource.raw(`    ${textMacro(gi.name)},`);
  }
  cgSource.raw('};');
  cgSource.raw('const u8 kAddItemFuncs[] = {');
  for (const gi of Object.values(GI)) {
    cgSource.raw(`    IA_${gi.addFunc},`);
  }
  cgSource.raw('};');
  cgSource.raw('const u16 kAddItemParams[] = {');
  for (const gi of Object.values(GI)) {
    cgSource.raw(`    ${gi.addParam},`);
  }
  cgSource.raw('};');
  await cgSource.emit();
}

async function genDrawGI() {
  /* Header */
  const cgHeader = new CodeGen(path.resolve('build', 'include', 'combo', 'drawgi_data.h'), "GENERATED_DRAWGI_DATA_H");
  cgHeader.define('DRAWGI_NONE', 0);
  for (const dgi of Object.values(DRAWGI)) {
    cgHeader.define(`DRAWGI_${dgi.id}`, dgi.index);
  }
  await cgHeader.emit();

  /* Source */
  const cgSource = new CodeGen(path.resolve('build', 'src', 'common', 'drawgi_data.c'));
  cgSource.include('combo.h');
  cgSource.include('combo/custom.h');
  cgSource.raw('const DrawGi kDrawGi[] = {');
  for (const dgi of Object.values(DRAWGI)) {
    cgSource.raw(`    { (void*)${dgi.func}, { ${dgi.params.join(', ')} } },`);
  }
  cgSource.raw('};');
  await cgSource.emit();
}

async function genCustom() {
  const data = JSON.parse(await fs.readFile(path.resolve('custom.json'), 'utf8'));
  const cg = new CodeGen(path.resolve('build', 'include', 'combo', 'custom.h'), "GENERATED_CUSTOM_H");
  for (const f of data.files) {
    const { defineBase } = f;
    cg.define(defineBase + '_VROM', f.vrom);
  }
  await cg.emit();
}

export async function codegen() {
  return Promise.all([
    genGI(),
    genDrawGI(),
    genCustom(),
    codegenFile(SCENES,               "SCE",      "scenes.h",       "GENERATED_SCENES_H"),
    codegenFile(NPC,                  "NPC",      "npc.h",          "GENERATED_NPC_H"),
    codegenFile(ENTRANCES,            "ENTR",     "entrances.h",    "GENERATED_ENTRANCES_H"),
    codegenFile(CONFVARS_VALUES,      "CFG",      "config.h",       "GENERATED_CONFIG_H"),
    codegenFile(PATCH_GROUP_VALUES,   "PG",       "patch_group.h",  "GENERATED_PATCH_GROUP_H"),
    codegenFile(PRICE_RANGES,         "PRICES",   "prices.h",       "GENERATED_PRICES_H"),
  ]);
};
