#ifndef Z_OBJ_TSUBO_H
#define Z_OBJ_TSUBO_H

#include <combo/actor.h>

struct Actor_ObjTsubo;

typedef void (*Actor_ObjTsubo_ActionFunc)(struct Actor_ObjTsubo*, GameState_Play*);

typedef struct Actor_ObjTsubo
{
    Actor                       actor;
    Actor_ObjTsubo_ActionFunc   actionFunc;
    ColliderCylinder            collider;
    s8                          requiredObjectSlot;
}
Actor_ObjTsubo;

#endif