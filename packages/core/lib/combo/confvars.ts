export const CONFVARS = [
  'GANON_NO_BOSS_KEY',
  'SMALL_KEY_SHUFFLE',
  'CSMC',
  'CSMC_EXTRA',
  'OOT_PROGRESSIVE_SHIELDS',
  'OOT_PROGRESSIVE_SWORDS',
  'OOT_PROGRESSIVE_SWORDS_GORON',
  'MM_PROGRESSIVE_SHIELDS',
  'MM_PROGRESSIVE_LULLABY',
  'DOOR_OF_TIME_OPEN',
  'ER_DUNGEONS',
  'ER_MAJOR_DUNGEONS',
  'SHARED_BOWS',
  'SHARED_BOMB_BAGS',
  'SHARED_MAGIC',
  'SHARED_MAGIC_ARROW_FIRE',
  'SHARED_MAGIC_ARROW_ICE',
  'SHARED_MAGIC_ARROW_LIGHT',
  'SHARED_SONG_EPONA',
  'SHARED_SONG_STORMS',
  'SHARED_SONG_TIME',
  'SHARED_SONG_SUN',
  'SHARED_NUTS_STICKS',
  'SHARED_HOOKSHOT',
  'SHARED_LENS',
  'SHARED_OCARINA',
  'SHARED_MASK_GORON',
  'SHARED_MASK_ZORA',
  'SHARED_MASK_BUNNY',
  'SHARED_MASK_TRUTH',
  'SHARED_MASK_KEATON',
  'SHARED_WALLETS',
  'SHARED_HEALTH',
  'SHARED_SOULS_ENEMY',
  'SHARED_OCARINA_BUTTONS',
  'SHARED_SHIELDS',
  'OOT_CROSS_WARP',
  'MM_CROSS_WARP',
  'MM_CROSS_WARP_ADULT',
  'MM_OCARINA_FAIRY',
  'MM_HOOKSHOT_SHORT',
  'MM_SONG_SUN',
  'OOT_SKIP_ZELDA',
  'OOT_OPEN_KAKARIKO_GATE',
  'ER_ANY',
  'OOT_LACS_CUSTOM',
  'OOT_GANON_BK_CUSTOM',
  'OOT_KZ_OPEN',
  'OOT_KZ_OPEN_ADULT',
  'GOAL_GANON',
  'GOAL_MAJORA',
  'GOAL_TRIFORCE',
  'MM_MAJORA_CHILD_CUSTOM',
  'FILL_WALLETS',
  'CHILD_WALLET',
  'OOT_OPEN_DEKU',
  'OOT_ADULT_WELL',
  'COLOSSAL_WALLET',
  'BOTTOMLESS_WALLET',
  'OOT_AGELESS_BOOTS',
  'MM_OWL_SHUFFLE',
  'CSMC_AGONY',
  'OOT_CARPENTERS_ONE',
  'OOT_CARPENTERS_NONE',
  'OOT_NO_BOSS_KEY',
  'OOT_NO_SMALL_KEY',
  'MM_NO_BOSS_KEY',
  'MM_NO_SMALL_KEY',
  'CSMC_HEARTS',
  'OOT_BLUE_FIRE_ARROWS',
  'OOT_SUNLIGHT_ARROWS',
  'ER_BOSS',
  'OOT_SILVER_RUPEE_SHUFFLE',
  'OOT_FREE_SCARECROW',
  'OOT_SOULS_ENEMY',
  'MM_SOULS_ENEMY',
  'OOT_SOULS_BOSS',
  'MM_SOULS_BOSS',
  'OOT_SOULS_NPC',
  'MM_REMOVED_FAIRIES',
  'SHARED_SKELETON_KEY',
  'OOT_SHUFFLE_POTS',
  'MM_SHUFFLE_POTS',
  'OOT_SHUFFLE_GRASS',
  'MM_SHUFFLE_GRASS',
  'MENU_NOTEBOOK',
  'OOT_AGELESS_CHILD_TRADE',
  'OOT_START_ADULT',
  'HINT_IMPORTANCE',
  'GOAL_TRIFORCE3',
  'OOT_OCARINA_BUTTONS',
  'MM_OCARINA_BUTTONS',
  'OOT_AGE_CHANGE',
  'OOT_AGE_CHANGE_NEEDS_OOT',
  'OOT_TRIAL_LIGHT',
  'OOT_TRIAL_FOREST',
  'OOT_TRIAL_FIRE',
  'OOT_TRIAL_WATER',
  'OOT_TRIAL_SHADOW',
  'OOT_TRIAL_SPIRIT',
  'MM_PROGRESSIVE_GFS',
  'OOT_CHEST_GAME_SHUFFLE',
  'MM_CLIMB_MOST_SURFACES',
  'ER_MOON',
  'MM_OPEN_MOON',
  'NO_BROKEN_ACTORS',
  'OOT_BOMBCHU_BAG',
] as const;

export type Confvar = typeof CONFVARS[number];

export const CONFVARS_VALUES: {[k in Confvar]: number} = {} as any;
for (let i = 0; i < CONFVARS.length; ++i) {
  CONFVARS_VALUES[CONFVARS[i]] = i;
}
