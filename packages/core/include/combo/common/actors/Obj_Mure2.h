#ifndef COMBO_COMMON_ACTOR_OBJ_MURE2_H
#define COMBO_COMMON_ACTOR_OBJ_MURE2_H

#if defined(GAME_MM)

#include <combo/xflags.h>
#include <combo/actor.h>

typedef struct ALIGNED(4)
{
    Actor           base;
    void*           handler;
    Actor*          children[12];
    char            unk_170[8];

    /* Extended flags */
    Xflag xflag;
}
Actor_ObjMure2;

_Static_assert(sizeof(Actor_ObjMure2) == (sizeof(Actor) + 0x44), "Actor_ObjMure2 size is wrong");

#endif

#endif
