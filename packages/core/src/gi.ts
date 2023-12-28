
import { isArray } from 'lodash';
import { RAW_GI } from '@ootmm/data';

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

export let GI: {[k: string]: DataGi} = {};
for (let i = 0; i < RAW_GI.length; ++i) {
  const v = RAW_GI[i];
  const index = i + 1;
  const id = v.id;
  const item = `ITEM_${v.item || 'NONE'}`;
  const flags = v.flags;
  let draw: string;
  let drawParam: number;
  if (v.draw) {
    if (isArray(v.draw)) {
      draw = v.draw[0].toString();
      drawParam = Number(v.draw[1]);
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
      object = { type: v.object[0], id: v.object[1] } as DataGi['object'];
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
      addFunc = v.add[0].toString();
      addParam = v.add[1].toString();
    } else {
      addFunc = v.add;
      addParam = '0';
    }
  } else {
    addFunc = 'NONE';
    addParam = '0';
  }
  GI[id] = { index, id, item, flags, draw, drawParam, object, name, addFunc, addParam };
}
