#include <combo.h>
#include <combo/custom.h>

static void ObjTsubo_Aliases(Xflag* xflag)
{
    switch (xflag->sceneId)
    {
    case SCE_MM_SOUTHERN_SWAMP_CLEAR:
        xflag->sceneId = SCE_MM_SOUTHERN_SWAMP;
        xflag->id += 3;
        break;
    case SCE_MM_GORON_SHRINE:
        if (xflag->setupId == 1)
        {
            xflag->setupId = 0;
            switch (xflag->roomId)
            {
            case 0: xflag->id -= 2; break;
            case 1: xflag->id += 3; break;
            }
        }
        break;
    case SCE_MM_GREAT_BAY_COAST:
        if (xflag->setupId == 1)
        {
            xflag->setupId = 0;
            if (xflag->id <= 15)
                xflag->id += 48;
            else
                xflag->id += 102;
        }
        break;
    case SCE_MM_ZORA_CAPE:
        if (xflag->setupId == 1)
        {
            xflag->setupId = 0;
            xflag->id += 9;
        }
        break;
    case SCE_MM_WOODFALL:
        if (xflag->setupId == 2)
        {
            xflag->setupId = 0;
            xflag->id -= 36;
        }
        break;
    case SCE_MM_MOUNTAIN_VILLAGE_SPRING:
        xflag->sceneId = SCE_MM_MOUNTAIN_VILLAGE_WINTER;
        xflag->id = 38;
        break;
    case SCE_MM_GORON_RACETRACK:
        xflag->setupId = 0;
        break;
    }
}

void ObjTsubo_InitWrapper(Actor_ObjTsubo* this, GameState_Play* play)
{
    ActorFunc ObjTsubo_Init;

    /* Setup the xflag */
    this->xflag.sceneId = play->sceneId;
    this->xflag.setupId = g.sceneSetupId;
    this->xflag.roomId = this->base.room;
    this->xflag.id = g.actorIndex;

    /* Resolve aliases */
    ObjTsubo_Aliases(&this->xflag);

    /* Invoke init */
    ObjTsubo_Init = (ActorFunc)actorAddr(AC_OBJ_TSUBO, 0x809278c0);
    ObjTsubo_Init(&this->base, play);
}

void ObjTsubo_SpawnShuffledDrop(Actor_ObjTsubo* this, GameState_Play* play)
{
    ActorFunc ObjTsubo_SpawnDrop;

    if (comboXflagsGet(&this->xflag))
    {
        /* Already spawned */
        ObjTsubo_SpawnDrop = (ActorFunc)actorAddr(AC_OBJ_TSUBO, 0x80927690);
        ObjTsubo_SpawnDrop(&this->base, play);
        return;
    }

    /* Spawn a custom item */
    DropCustomItem(play, &this->base.position, &this->xflag);
}


static const Gfx kDrawListNormalTop[] = {
    gsDPLoadTextureBlock(0x06001000, G_IM_FMT_RGBA, G_IM_SIZ_16b, 16, 16, 0, G_TX_NOMIRROR | G_TX_CLAMP, G_TX_NOMIRROR | G_TX_CLAMP, 4, 4, 0, 0),
    gsSPEndDisplayList(),
};

static const Gfx kDrawListNormalSide[] = {
    gsDPLoadTextureBlock(0x06000000, G_IM_FMT_RGBA, G_IM_SIZ_16b, 32, 64, 0, G_TX_NOMIRROR | G_TX_WRAP, G_TX_NOMIRROR | G_TX_WRAP, 5, 6, 0, 0),
    gsSPEndDisplayList(),
};

static const Gfx kDrawListNormalDangeonTop[] = {
    gsDPLoadTextureBlock(0x05011EC0, G_IM_FMT_RGBA, G_IM_SIZ_16b, 16, 16, 0, G_TX_NOMIRROR | G_TX_CLAMP, G_TX_NOMIRROR | G_TX_CLAMP, 4, 4, 0, 0),
    gsSPEndDisplayList(),
};

static const Gfx kDrawListNormalDangeonSide[] = {
    gsDPLoadTextureBlock(0x05010EC0, G_IM_FMT_RGBA, G_IM_SIZ_16b, 32, 64, 0, G_TX_NOMIRROR | G_TX_WRAP, G_TX_NOMIRROR | G_TX_WRAP, 5, 6, 0, 0),
    gsSPEndDisplayList(),
};

static const Gfx kDrawListMagicTop[] = {
    gsDPLoadTextureBlock(0x060013E0, G_IM_FMT_RGBA, G_IM_SIZ_16b, 16, 16, 0, G_TX_NOMIRROR | G_TX_CLAMP, G_TX_NOMIRROR | G_TX_CLAMP, 4, 4, 0, 0),
    gsSPEndDisplayList(),
};

static const Gfx kDrawListMagicSide[] = {
    gsDPLoadTextureBlock(0x060003E0, G_IM_FMT_RGBA, G_IM_SIZ_16b, 32, 64, 0, G_TX_NOMIRROR | G_TX_WRAP, G_TX_NOMIRROR | G_TX_WRAP, 5, 6, 0, 0),
    gsSPEndDisplayList(),
};

static const Gfx kDrawListMajorTop[] = {
    gsDPLoadTextureBlock(0x09000000 | CUSTOM_KEEP_POT_MAJOR_TOP, G_IM_FMT_RGBA, G_IM_SIZ_16b, 16, 16, 0, G_TX_NOMIRROR | G_TX_CLAMP, G_TX_NOMIRROR | G_TX_CLAMP, 4, 4, 0, 0),
    gsSPEndDisplayList(),
};

static const Gfx kDrawListMajorSide[] = {
    gsDPLoadTextureBlock(0x09000000 | CUSTOM_KEEP_POT_MAJOR_SIDE, G_IM_FMT_RGBA, G_IM_SIZ_16b, 32, 64, 0, G_TX_NOMIRROR | G_TX_WRAP, G_TX_NOMIRROR | G_TX_WRAP, 5, 6, 0, 0),
    gsSPEndDisplayList(),
};

void ObjTsubo_Draw(Actor_ObjTsubo* this, GameState_Play* play)
{
    u32 dlistAddr;
    const void* dlistSide;
    const void* dlistTop;

    /* Get the default pot drawing */
    switch ((this->base.variable >> 7) & 3)
    {
    case 0:
    case 3:
        dlistAddr = 0x05017ea0;
        dlistSide = kDrawListNormalDangeonSide;
        dlistTop = kDrawListNormalDangeonTop;
        break;
    case 1:
        dlistAddr = 0x06000278;
        dlistSide = kDrawListMagicSide;
        dlistTop = kDrawListMagicTop;
        break;
    case 2:
        dlistAddr = 0x060017c0;
        dlistSide = kDrawListNormalSide;
        dlistTop = kDrawListNormalTop;
        break;
    }

    /* Checks flag and dangeon_keep */
    if (comboConfig(CFG_MM_SHUFFLE_POTS) && !comboXflagsGet(&this->xflag))
    {
        dlistSide = kDrawListMajorSide;
        dlistTop = kDrawListMajorTop;
    }

    /* Setup the textures */
    OPEN_DISPS(play->gs.gfx);
    gSPSegment(POLY_OPA_DISP++, 0x09, gCustomKeep);
    gSPSegment(POLY_OPA_DISP++, 0x0a, dlistSide);
    gSPSegment(POLY_OPA_DISP++, 0x0b, dlistTop);
    CLOSE_DISPS();

    /* Draw */
    DrawSimpleOpa(play, dlistAddr);
}

PATCH_FUNC(0x809294b0, ObjTsubo_Draw);
