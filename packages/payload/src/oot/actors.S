#include <combo.h>

/* Handle rooms with no enemies because of souls */
PATCH_START 0x8002508c
  jal SetRoomClearHook
PATCH_END
