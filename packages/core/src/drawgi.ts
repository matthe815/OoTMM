
import { RAW_DRAWGI } from '@ootmm/data';

type DataDrawGi = {
  index: number;
  id: string;
  func: string;
  params: string[];
};

export let DRAWGI: {[k: string]: DataDrawGi} = {};
for (let i = 0; i < RAW_DRAWGI.length; ++i) {
  const v = RAW_DRAWGI[i];
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

  DRAWGI[id] = { index, id, func, params };
}
