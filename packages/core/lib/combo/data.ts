import { isArray } from 'lodash';

export { WORLD as DATA_WORLD } from '@ootmm/data';

export { default as DATA_SCENES } from '../../data/scenes.yml';
export { default as DATA_NPC } from '../../data/npc.yml';
export { default as DATA_REGIONS } from '../../data/regions.yml';
export { default as DATA_HINTS } from '../../data/hints.yml';
export { default as DATA_ENTRANCES } from '../../data/entrances.yml';

import poolOot from '../../data/oot/pool.csv';
import poolMm from '../../data/mm/pool.csv';

export const DATA_POOL = {
  oot: poolOot,
  mm: poolMm,
};

import macrosOot from '../../data/oot/macros.yml';
import macrosMm from '../../data/mm/macros.yml';
import macrosCommon from '../../data/macros.yml';

export const DATA_MACROS = {
  oot: macrosOot,
  mm: macrosMm,
  common: macrosCommon,
};

import entrancesOot from '../../data/oot/entrances.csv';
import entrancesMm from '../../data/mm/entrances.csv';

export const DATA_ENTRANCES_POOL = {
  oot: entrancesOot,
  mm: entrancesMm,
};

import rawGi from '../../data/gi.yml';

type DataGi = {
  index: number;
  id: string;
  item: string;
  flags: number;
  draw: string;
  drawParam: number;
  addFunc: string;
  addParam: string;
  object: { type: 'oot' | 'mm', id: number } | { type: 'custom', id: string } | null;
  name: string;
};

export let DATA_GI: {[k: string]: DataGi} = {};
for (let i = 0; i < rawGi.length; ++i) {
  const v = rawGi[i];
  const index = i + 1;
  const id = v.id;
  const item = `ITEM_${v.item || 'NONE'}`;
  const flags = v.flags;
  let draw: string;
  let drawParam: number;
  if (v.draw) {
    if (isArray(v.draw)) {
      draw = v.draw[0];
      drawParam = v.draw[1];
    } else {
      draw = v.draw;
      drawParam = 0;
    }
  } else {
    draw = 'NONE';
    drawParam = 0;
  }
  draw = `DRAWGI_${draw}`;
  let object: DataGi['object'];
  if (v.object) {
    if (isArray(v.object)) {
      object = { type: v.object[0], id: v.object[1] };
    } else {
      object = { type: 'custom', id: v.object };
    }
  } else {
    object = null;
  }
  const name = v.name || "";
  let addFunc: string;
  let addParam: string;
  if (v.add) {
    if (isArray(v.add)) {
      addFunc = v.add[0];
      addParam = v.add[1].toString();
    } else {
      addFunc = v.add;
      addParam = '0';
    }
  } else {
    addFunc = 'NONE';
    addParam = '0';
  }
  DATA_GI[id] = { index, id, item, flags, draw, drawParam, object, name, addFunc, addParam };
}

import rawDrawGi from '../../data/drawgi.yml';

type DataDrawGi = {
  index: number;
  id: string;
  func: string;
  params: string[];
};

export let DATA_DRAWGI: {[k: string]: DataDrawGi} = {};
for (let i = 0; i < rawDrawGi.length; ++i) {
  const v = rawDrawGi[i];
  const index = i + 1;
  const id = v.id;
  let func: string;
  const params: string[] = [];

  if (typeof v.func === 'string') {
    func = `DrawGi_${v.func}`;
  } else {
    func = `0x${v.func.toString(16)}`;
  }

  if (v.params) {
    for (const p of v.params) {
      if (typeof p === 'string') {
        params.push(`CUSTOM_OBJECT_${p}`);
      } else {
        params.push(`0x${p.toString(16)}`);
      }
    }
  }

  DATA_DRAWGI[id] = { index, id, func, params };
}

const mapGossip = (game: Game, data: any[]) => {
  const result: {[k: string]: any} = {};
  for (const v of data) {
    const key = gameId(game, v.location, ' ');
    result[key] = { type: v.type, id: parseInt(v.id) }
  }
  return result;
};

import hintsOot from '../../data/oot/hints.csv';
import hintsMm from '../../data/mm/hints.csv';
import { Game } from './config';
import { gameId } from './util';

export const DATA_HINTS_POOL = {
  oot: mapGossip('oot', hintsOot),
  mm: mapGossip('mm', hintsMm),
};
