<template>
  <canvas ref="gameCanvas" id="root"></canvas>
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

    function createBackground() {
      // Load the texture from an image URL
      PIXI.Loader.shared.reset(); // Reset the PIXI.Loader.shared
      PIXI.Loader.shared
        .add('backgroundImage', '6432-grid_2.png')
        .load((_, resources) => {
          // Create a TilingSprite from the texture
          const background = new PIXI.TilingSprite(
            resources.backgroundImage.texture,
            this.application.screen.width,
            this.application.screen.height
          );

          // Set the size of the TilingSprite
          background.width = this.application.screen.width;
          background.height = this.application.screen.height;

          // Add the TilingSprite to the stage
          this.application.stage.addChildAt(background, 0);
        });
    }

    onMounted(() => {
      const application = new PIXI.Application({
        view: gameCanvas.value,
        transparent: true,
        backgroundColor: 0x1e1e1e,
        resolution: window.devicePixelRatio,
        autoDensity: true,
      });

      const shroom = Shroom.create({
        application,
        resourcePath: 'https://ducket.net/resources',
      });

      const room = Room.create(shroom, {
        tilemap: `
          00
          00
        `,
      });
      room.hideWalls = true;
      room.x = 200;
      room.y = 200;

      const avatar = new Avatar({
        roomX: 0.5,
        roomY: 0.5,
        roomZ: 0,
        direction: 2,
        look: 'hd-180-1.hr-828-56.ch-255-1420.lg-281-1420.sh-295-62',
      });

      avatar.effect = '220';

      // avatar.addAction(AvatarAction.Sleep);
      avatar.addAction(AvatarAction.Move);

      room.addRoomObject(avatar);
      application.stage.addChild(room);
    });

    return { gameCanvas };
  },
};
</script>

<style scoped>
#root {
  /* Add your styles here */
}
</style>
