<template>
  <div class="mt-12 text-white">
    <div
      class="rounded-lg border-1 border-opacity-50 border-white border w-[150px] mx-auto"
    >
      <canvas ref="gameCanvas" id="root" class="w-[150px]"></canvas>
      {{ effect }}
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import * as PIXI from 'pixi.js';
import {
  Room,
  Avatar,
  Shroom,
  BaseAvatar,
  AvatarAction,
} from '@tetreum/shroom';

export default {
  setup() {
    const gameCanvas = ref(null);

    //High FPS Walk
    // let effect = ref(194);

    //Jump
    let effect = ref(193);

    // 156
    //165
    // 175
    // 185
    //193
    //195

    onMounted(() => {
      const application = new PIXI.Application({
        view: gameCanvas.value,
        transparent: true,
        backgroundColor: 0x1e1e1e,
        resolution: window.devicePixelRatio,
        autoDensity: true,
        height: 250,
        width: 200,
      });

      const shroom = Shroom.create({
        application,
        resourcePath: 'https://ducket.net/resources',
      });

      const room = Room.create(shroom, {
        tilemap: `
          0
        `,
      });
      room.hideWalls = true;
      room.x = 42;
      room.y = 175;

      const avatar = new Avatar({
        roomX: 0,
        roomY: 0,
        roomZ: 0,
        direction: 2,
        look: 'hd-3762-2.hd-180-1.hr-828-56.ch-255-1420.lg-281-1420.sh-295-62',
      });

      avatar.effect = effect.value.toString();

      avatar.addAction(AvatarAction.Sit);
      // avatar.addAction(AvatarAction.Lay);

      room.addRoomObject(avatar);
      application.stage.addChild(room);
    });

    return { gameCanvas, effect };
  },
};
</script>

<style scoped>
#root {
  /* Add your styles here */
}
</style>
