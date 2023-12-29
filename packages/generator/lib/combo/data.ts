import { isArray } from 'lodash';

export { WORLD as DATA_WORLD } from '@ootmm/data';

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
import { Game } from '@ootmm/core/src/config';
import { gameId } from './util';

export const DATA_HINTS_POOL = {
  oot: mapGossip('oot', hintsOot),
  mm: mapGossip('mm', hintsMm),
};
