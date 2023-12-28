const OOT_SHOP_KOKIRI = [ 10, 20, 60, 30, 15, 30, 10, 40 ];
const OOT_SHOP_BOMBCHU = [ 180, 180, 180, 180, 100, 100, 100, 100 ];
const OOT_SHOP_ZORA = [ 50, 90, 200, 15, 20, 60, 300, 10 ];
const OOT_SHOP_GORON = [ 10, 10, 40, 200, 25, 50, 80, 120 ];
const OOT_SHOP_BAZAAR = [ 20, 60, 90, 10, 35, 10, 15, 80 ];
const OOT_SHOP_POTION = [ 200, 50, 30, 15, 300, 50, 30, 30 ];

const OOT_SHOPS = [
  ...OOT_SHOP_KOKIRI,
  ...OOT_SHOP_BOMBCHU,
  ...OOT_SHOP_ZORA,
  ...OOT_SHOP_GORON,
  ...OOT_SHOP_BAZAAR,
  ...OOT_SHOP_POTION,
  ...OOT_SHOP_BAZAAR,
  ...OOT_SHOP_POTION,
];

const OOT_SCRUBS_OVERWORLD = [ 40, 15, 20, 40, 40, 40, 40, 10, 20, 40, 40, 20, 40, 40, 40, 20, 40, 40, 40, 40, 20, 40, 40, 40, 40, 40, 40 ];
const OOT_SCRUBS_DT = [ 0 ];
const OOT_SCRUBS_DT_MQ = [ 50 ];
const OOT_SCRUBS_DC = [ 40, 15, 20, 50 ];
const OOT_SCRUBS_DC_MQ = [ 40, 15, 50, 40 ];
const OOT_SCRUBS_JJ = [ 20 ];
const OOT_SCRUBS_JJ_MQ = [ 0 ];
const OOT_SCRUBS_GC = [40, 40, 70, 40, 0];
const OOT_SCRUBS_GC_MQ = [40, 40, 70, 40, 20];

const OOT_SCRUBS = [
  ...OOT_SCRUBS_OVERWORLD,
  ...OOT_SCRUBS_DT,
  ...OOT_SCRUBS_DC,
  ...OOT_SCRUBS_JJ,
  ...OOT_SCRUBS_GC,
];

const MM_SHOP_BOMB = [30, 40, 50, 90];
const MM_SHOP_CURIOSITY = [500];
const MM_SHOP_TRADING = [30, 80, 80, 50, 10, 30, 30, 30];
const MM_SHOP_POTION = [60, 10, 20];
const MM_SHOP_GORON = [40, 40, 80];
const MM_SHOP_ZORA = [90, 20, 60];

const MM_SHOPS = [
  ...MM_SHOP_BOMB,
  ...MM_SHOP_CURIOSITY,
  ...MM_SHOP_TRADING,
  ...MM_SHOP_POTION,
  ...MM_SHOP_GORON,
  ...MM_SHOP_ZORA,
];

const MM_SHOP_EX_CURIOSITY = [100];

const MM_SHOPS_EX = [
  ...MM_SHOP_EX_CURIOSITY,
];

const MM_TINGLE = [5, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40];

const PRICES = {
  OOT_SHOPS,
  OOT_SCRUBS,
  MM_SHOPS,
  MM_SHOPS_EX,
  MM_TINGLE,
  MAX: [],
} as const;

export const DEFAULT_PRICES = Object.values(PRICES).flat();

const PRICE_COUNTS = Object.fromEntries(Object.entries(PRICES).map(([a, b]) => [a, b.length]));

export const PRICE_RANGES: {[k: string] :number} = {};

(function() {
  let offset = 0;
  for (const k of Object.keys(PRICE_COUNTS)) {
    PRICE_RANGES[k] = offset;
    offset += (PRICE_COUNTS as any)[k];
  }
})();
