#include <combo.h>
#include <combo/dungeon.h>
#include <combo/entrance.h>
#include <combo/config.h>
#include <combo/actor.h>

typedef struct
{
    Actor base;
}
Actor_CustomWarp;

static void CustomWarp_Reload(void)
{
    Play_SetupRespawnPoint(gPlay, 1, 0xdff);
    gSaveContext.respawnFlag = 2;
    comboTransition(gPlay, gSave.entrance);
}

#if defined(GAME_OOT)

#define SWITCH_LAKE_HYLIA_WATER 0

static void CustomWarp_OnTrigger(Actor_CustomWarp* this, GameState_Play* play)
{
    switch (this->base.params)
    {
    case SWITCH_LAKE_HYLIA_WATER:
        CustomWarp_Reload();
        if(BITMAP16_GET(gOotSave.eventsChk, EV_OOT_CHK_LAKE_HYLIA_WATER))
            BITMAP16_CLEAR(gOotSave.eventsChk, EV_OOT_CHK_LAKE_HYLIA_WATER);
        else
            BITMAP16_SET(gOotSave.eventsChk, EV_OOT_CHK_LAKE_HYLIA_WATER);
        break;
    }
}
#endif

#if defined(GAME_MM)

#define SWITCH_SPRING           0
#define SWITCH_SWAMP_CLEAR      1
#define SWITCH_COAST_CLEAR      2
#define SWITCH_VALLEY_CLEAR     3
#define SWITCH_OPEN_MOON        4
#define SWITCH_OPEN_ST_NORMAL   5
#define SWITCH_OPEN_ST_INVERTED 6

static void CustomWarp_OnTrigger(Actor_CustomWarp* this, GameState_Play* play)
{
    play->transitionTrigger = TRANS_TRIGGER_NORMAL;
    play->transitionType = TRANS_TYPE_FADE_BLACK;

    switch (this->base.params)
    {
    case SWITCH_SPRING:
        MM_SET_EVENT_WEEK(EV_MM_WEEK_DUNGEON_SH);
        play->nextEntrance = 0xae70;
        break;
    case SWITCH_SWAMP_CLEAR:
        MM_SET_EVENT_WEEK(EV_MM_WEEK_DUNGEON_WF);
        if (Config_Flag(CFG_MM_CLEAR_OPEN_WF))
            MM_SET_EVENT_WEEK(EV_MM_WEEK_WOODFALL_TEMPLE_RISE);
        CustomWarp_Reload();
        break;
    case SWITCH_COAST_CLEAR:
        MM_SET_EVENT_WEEK(EV_MM_WEEK_DUNGEON_GB);
        if (Config_Flag(CFG_MM_CLEAR_OPEN_GB))
            MM_SET_EVENT_WEEK(EV_MM_WEEK_GREAT_BAY_TURTLE);
        CustomWarp_Reload();
        break;
    case SWITCH_VALLEY_CLEAR:
        MM_SET_EVENT_WEEK(EV_MM_WEEK_DUNGEON_ST);
        CustomWarp_Reload();
        break;
    case SWITCH_OPEN_MOON:
        play->nextEntrance = 0xc800;
        gSaveContext.timerStates[3] = 0;
        break;
    case SWITCH_OPEN_ST_NORMAL:
        play->nextEntrance = 0xac00;
        Flags_SetSwitch(play, 0x14);
        break;
    case SWITCH_OPEN_ST_INVERTED:
        play->nextEntrance = 0xaa10;
        ClearSwitchFlag(play, 0x14);
        break;
    }
}
#endif

static void CustomWarp_Init(Actor_CustomWarp* this, GameState_Play* play)
{
    this->base.room = 0xff;
}

static void CustomWarp_Update(Actor_CustomWarp* this, GameState_Play* play)
{
    if (ActorTalkedTo(&this->base))
    {
        CustomWarp_OnTrigger(this, play);
    }
    else
    {
        ActorEnableTalk(&this->base, play, 30.f);
    }
}

/* TODO: Move this into a helper */
static void shaderFlameEffect(GameState_Play* play)
{
#if defined(GAME_OOT)
    static const u32 kFlameDlist = 0x52a10;
#else
    static const u32 kFlameDlist = 0x7d590;
#endif

    OPEN_DISPS(play->gs.gfx);
    ModelViewUnkTransform(&play->billboardMtxF);
    gSPSegment(POLY_XLU_DISP++, 0x08, DisplaceTexture(play->gs.gfx, 0, 0, 0, 0x20, 0x40, 1, 0, (-play->gs.frameCount & 0x7f) << 2, 0x20, 0x80));
    gSPMatrix(POLY_XLU_DISP++, GetMatrixMV(play->gs.gfx), G_MTX_NOPUSH | G_MTX_LOAD | G_MTX_MODELVIEW);
    gDPSetPrimColor(POLY_XLU_DISP++, 0x80, 0x80, 0xff, 0x00, 0xff, 0xff);
    gDPSetEnvColor(POLY_XLU_DISP++, 0xff, 0x00, 0x00, 0xff);
    gSPDisplayList(POLY_XLU_DISP++, 0x04000000 | kFlameDlist);
    CLOSE_DISPS();
}

static void CustomWarp_Draw(Actor_CustomWarp* this, GameState_Play* play)
{
    static const float scale = 0.003f;

    /* Transform */
    Matrix_Translate(this->base.world.pos.x, this->base.world.pos.y, this->base.world.pos.z, MAT_SET);
    Matrix_Scale(scale, scale, scale, MAT_MUL);

    /* Draw */
    OPEN_DISPS(play->gs.gfx);
    Gfx_SetupDL25_Xlu(play->gs.gfx);
    shaderFlameEffect(play);
    CLOSE_DISPS();
}

ActorProfile CustomWarp_gActorProfile = {
    AC_CUSTOM_WARP,
    0x7,
    0x11,
    0x1,
    sizeof(Actor_CustomWarp),
    (ActorFunc)CustomWarp_Init,
    NULL,
    (ActorFunc)CustomWarp_Update,
    (ActorFunc)CustomWarp_Draw,
};

void comboSpawnCustomWarps(GameState_Play* play)
{
    int variable;
    float x;
    float y;
    float z;

    variable = -1;

#if defined(GAME_MM)
    if ((Config_Flag(CFG_ER_MAJOR_DUNGEONS) || gComboConfig.preCompleted & (1 << DUNGEONID_TEMPLE_SNOWHEAD)) && play->sceneId == SCE_MM_MOUNTAIN_VILLAGE_WINTER && gMiscFlags.erSpring)
    {
        variable = SWITCH_SPRING;
        x = -1200.f;
        y = 30.f;
        z = 600.f;
    }

    if ((Config_Flag(CFG_ER_MAJOR_DUNGEONS) || gComboConfig.preCompleted & (1 << DUNGEONID_TEMPLE_WOODFALL)) && play->sceneId == SCE_MM_SOUTHERN_SWAMP && !MM_GET_EVENT_WEEK(EV_MM_WEEK_DUNGEON_WF) && gMiscFlags.erSwampClear)
    {
        variable = SWITCH_SWAMP_CLEAR;
        x = -910.f;
        y = 50.f;
        z = -550.f;
    }

    if ((Config_Flag(CFG_ER_MAJOR_DUNGEONS) || gComboConfig.preCompleted & (1 << DUNGEONID_TEMPLE_GREAT_BAY)) && play->sceneId == SCE_MM_GREAT_BAY_COAST && !MM_GET_EVENT_WEEK(EV_MM_WEEK_DUNGEON_GB) && gMiscFlags.erCoastClear)
    {
        variable = SWITCH_COAST_CLEAR;
        x = -3020.f;
        y = 240.f;
        z = 3921.f;
    }

    if ((Config_Flag(CFG_ER_MAJOR_DUNGEONS) || gComboConfig.preCompleted & (1 << DUNGEONID_TEMPLE_STONE_TOWER)) && play->sceneId == SCE_MM_IKANA_CANYON && !MM_GET_EVENT_WEEK(EV_MM_WEEK_DUNGEON_ST) && gMiscFlags.erValleyClear)
    {
        variable = SWITCH_VALLEY_CLEAR;
        x = -700.f;
        y = 200.f;
        z = 2500.f;
    }

    if (Config_Flag(CFG_MM_OPEN_MOON) && Config_SpecialCond(SPECIAL_MOON) && play->sceneId == SCE_MM_CLOCK_TOWER_ROOFTOP)
    {
        variable = SWITCH_OPEN_MOON;
        x = 212.f;
        y = 30.f;
        z = 0.f;
    }

    if (Config_Flag(CFG_MM_OPEN_ST) && play->sceneId == SCE_MM_STONE_TOWER)
    {
        variable = SWITCH_OPEN_ST_NORMAL;
        x = 560.f;
        y = -560.f;
        z = 3000.f;
    }

    if (Config_Flag(CFG_MM_OPEN_ST) && play->sceneId == SCE_MM_STONE_TOWER_INVERTED)
    {
        variable = SWITCH_OPEN_ST_INVERTED;
        x = 242.f;
        y = 854.f;
        z = -690.f;
    }
#endif

#if defined(GAME_OOT)
    if (play->sceneId == SCE_OOT_LAKE_HYLIA && gMiscFlags.erWaterBeaten && gSave.age == AGE_ADULT)
    {
        variable = SWITCH_LAKE_HYLIA_WATER;
        x = -850.f;
        y = -1223.f;
        z = 6950.f;
    }
#endif

    if (variable == -1)
        return;

    Actor_Spawn(
        &play->actorCtx,
        play,
        AC_CUSTOM_WARP,
        x, y, z,
        0, 0, 0,
        variable
    );
}
